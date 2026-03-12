const express = require("express");
const router = express.Router({ mergeParams: true });

const { registerServiceProvider } = require("../controllers/serviceController");
const transporter = require("../services/mail");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");

/* Register service provider */

router.post("/register-service", registerServiceProvider);


/* Get all services with pincodes */

router.get("/all", async (req, res) => {

  try {

    const services = await ServiceProvider.find();

    const listServices = services
      .filter(service => service.pincode)
      .map(service => ({

        center: service.center,
        pincode: service.pincode,
        email: service.email,
        city: service.city,
        owner: service.owner

      }));

    res.json({ listServices });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});


/* Request Service */

router.post("/request-service", async (req, res) => {

  try {

    const {
      providerEmail,
      userEmail,
      center,
      vehicleNumber,
     
    } = req.body;

    console.log("Service Provider:", providerEmail);
    console.log("User Email:", userEmail);
    console.log("Vehicle:", vehicleNumber);

    /* FIND SERVICE PROVIDER */

    const provider = await ServiceProvider.findOne({
      email: providerEmail
    });
    const serviceUser=await User.findOne({email:userEmail});
   console.log("Service user found:", serviceUser);
     console.log("Service provider found:", provider);
    if (!provider) {

      return res.status(404).json({
        message: "Service provider not found"
      });

    }


    /* STORE REQUEST IN DATABASE */
  
    provider.serviceRequests.push({

      userEmail,
      vehicleNumber:serviceUser.vehicle.vehicleNumber,
      
      status: "pending"

    });

    await provider.save();


    /* SEND EMAIL */

    await transporter.sendMail({

      from: process.env.EMAIL_USER,
      to: providerEmail,

      subject: "New Vehicle Service Request",

      html: `
        <h2>New Service Request</h2>

        <p>A vehicle owner has requested service.</p>

        <p><b>Service Center:</b> ${center}</p>
        <p><b>User Email:</b> ${userEmail}</p>
        <p><b>Vehicle Number:</b> ${vehicleNumber}</p>
       

        <p>Please login to the service dashboard to accept the request.</p>
      `

    });

    res.json({
      message: "Service request stored and email sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error sending request"
    });

  }

});


router.get("/requests/:email", async (req, res) => {

  try {
   console.log("Fetching requests for service provider email:", req.params.email);
    const providerEmail = req.params.email;

    const provider = await ServiceProvider.findOne({
      email: providerEmail
    });

    if (!provider) {

      return res.status(404).json({
        message: "Service provider not found"
      });

    }

    /* Extract request list */

    const requests = provider.serviceRequests.map(req => ({

      userEmail: req.userEmail,
      vehicleNumber: req.vehicleNumber,
      status: req.status,
      createdAt: req.createdAt

    }));

    res.json({
      center: provider.center,
      city: provider.city,
      mechanics: provider.mechanics,
      requests: requests
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

router.patch("/accept-request", async (req, res) => {

  try {

    const { providerEmail, requestUserMail } = req.body;

    const provider = await ServiceProvider.findOne({
      email: providerEmail
    });

    if (!provider) {
      return res.status(404).json({
        message: "Service provider not found"
      });
    }

    // const request = provider.serviceRequests.id(requestId);
    const findRequest = provider.serviceRequests.find(req => req.userEmail === requestUserMail);

     console.log("Request found for acceptance:", findRequest);
    if (!findRequest) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    /* Update status */

    findRequest.status = "accepted";

    await provider.save();

    /* Send mail to vehicle owner */

    await transporter.sendMail({

      from: process.env.EMAIL_USER,
      to: requestUserMail.userEmail,

      subject: "Your Vehicle Service Request has been Accepted",

      html: `
        <h2>Service Request Accepted</h2>

        <p>Your service request has been <b>accepted</b>.</p>

        <p><b>Service Center:</b> ${provider.center}</p>
        <p><b>City:</b> ${provider.city}</p>

        <p>You can visit the service center at your convenient time.</p>

        <p>Thank you for using our platform.</p>
      `
    });

    res.json({
      message: "Request accepted and email sent"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error accepting request"
    });

  }

});

router.patch("/reject-request", async (req, res) => {

  try {

    const { providerEmail, requestUserMail } = req.body;

    const provider = await ServiceProvider.findOne({
      email: providerEmail
    });

    if (!provider) {
      return res.status(404).json({
        message: "Service provider not found"
      });
    }

    const findrequest = provider.serviceRequests.find(req => req.userEmail === requestUserMail);

    if (!findrequest) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    findrequest.status = "rejected";

    await provider.save();

    /* Send rejection mail */

    await transporter.sendMail({

      from: process.env.EMAIL_USER,
      to: findrequest.userEmail,

      subject: "Service Request Update",

      html: `
        <h2>Service Request Update</h2>

        <p>Your vehicle service request was <b>rejected</b> by the service provider.</p>

        <p>Please login to our platform to find another service provider.</p>

        <p><a href="http://localhost:5173/login">Login to Platform</a></p>

        <p>Thank you.</p>
      `
    });

    res.json({
      message: "Request rejected and email sent"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error rejecting request"
    });

  }

});
module.exports = router;