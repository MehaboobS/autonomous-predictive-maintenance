import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ServiceDashboard = () => {

  const user = useSelector((state) => state.auth.user);

  const [requests,setRequests] = useState([]);
  const [centerInfo,setCenterInfo] = useState(null);
  const [loading,setLoading] = useState(false);

  const fetchRequests = async () => {

    try{

      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/services/requests/${user.email}`
      );

      const data = await res.json();

      setRequests(data.requests);
      setCenterInfo(data);

      setLoading(false);

    }
    catch(err){

      console.log("Error fetching requests:",err);
      setLoading(false);

    }

  };

  useEffect(()=>{

    if(user?.email){
      fetchRequests();
    }

  },[user?.email]);


  /* ACCEPT REQUEST */

  const acceptRequest = async (requestUserMail) => {

    try{

      setLoading(true);

      await fetch(
        `${BASE_URL}/api/services/accept-request`,
        {
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            providerEmail:user.email,
            requestUserMail
          })
        }
      );

      await fetchRequests();

      setLoading(false);

    }
    catch(err){

      console.log("Accept error:",err);
      setLoading(false);

    }

  };


  /* REJECT REQUEST */

  const rejectRequest = async (requestUserMail) => {

    try{

      setLoading(true);

      await fetch(
        `${BASE_URL}/api/services/reject-request`,
        {
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            providerEmail:user.email,
            requestUserMail
          })
        }
      );

      await fetchRequests();

      setLoading(false);

    }
    catch(err){

      console.log("Reject error:",err);
      setLoading(false);

    }

  };


  return(

  <HeroSection>

    {/* LOADER */}
    {loading && <Loader />}

    <div className="px-4 sm:px-6 md:px-10 py-6 text-white space-y-8">

      {/* HEADER */}

      <h1 className="text-2xl sm:text-3xl font-bold">
        Service Provider Dashboard
      </h1>


      {/* SERVICE CENTER INFO */}

      {centerInfo && (

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-black/50 p-4 sm:p-6 rounded-xl backdrop-blur-md">
          <h2 className="text-lg sm:text-xl text-yellow-400">
            Service Center
          </h2>
          <p className="text-sm sm:text-base">{centerInfo.center}</p>
        </div>

        <div className="bg-black/50 p-4 sm:p-6 rounded-xl backdrop-blur-md">
          <h2 className="text-lg sm:text-xl text-yellow-400">
            City
          </h2>
          <p className="text-sm sm:text-base">{centerInfo.city}</p>
        </div>

        <div className="bg-black/50 p-4 sm:p-6 rounded-xl backdrop-blur-md">
          <h2 className="text-lg sm:text-xl text-yellow-400">
            Mechanics Available
          </h2>
          <p className="text-sm sm:text-base">{centerInfo.mechanics}</p>
        </div>

      </div>

      )}


      {/* SERVICE REQUESTS */}

      <div className="bg-black/60 p-4 sm:p-6 rounded-xl backdrop-blur-md">

        <h2 className="text-lg sm:text-xl text-yellow-400 mb-4 sm:mb-6">
          Incoming Service Requests
        </h2>

        {requests.length === 0 && (
          <p className="text-sm sm:text-base">No service requests yet.</p>
        )}

        {requests.map((req,index)=>(

          <div
            key={index}
            className="bg-black/50 p-4 rounded-lg mb-4
            flex flex-col sm:flex-row
            sm:justify-between sm:items-center
            gap-4
            border border-gray-700 hover:border-yellow-400 transition"
          >

            {/* REQUEST INFO */}

            <div className="text-sm sm:text-base">

              <p>
                <b>User Email:</b> {req.userEmail}
              </p>

              <p>
                <b>Vehicle Number:</b> {req.vehicleNumber}
              </p>

              <p>
                <b>Status:</b>

                <span className={`ml-2 font-semibold ${
                  req.status === "accepted"
                    ? "text-green-400"
                    : req.status === "rejected"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}>
                  {req.status}
                </span>

              </p>

              <p className="text-xs sm:text-sm text-gray-400">
                {new Date(req.createdAt).toLocaleString()}
              </p>

            </div>


            {/* ACTION BUTTONS */}

            <div className="flex gap-3 sm:gap-4">

              <button
                onClick={()=>acceptRequest(req.userEmail)}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-2 bg-green-500 rounded-lg
                hover:bg-green-400 hover:scale-105
                transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                Accept
              </button>

              <button
                onClick={()=>rejectRequest(req.userEmail)}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-500 rounded-lg
                hover:bg-red-400 hover:scale-105
                transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  </HeroSection>

);

};

export default ServiceDashboard;