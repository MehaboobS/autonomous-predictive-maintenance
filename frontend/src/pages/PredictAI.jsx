import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import useAlert from "../hooks/useAlert";

const PredictAI = () => {

  const [telemetry, setTelemetry] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const { alert, showAlert, closeAlert } = useAlert();
  const navigate = useNavigate();

  /* Check if user is logged in */

  useEffect(() => {

    if (!user) {

      showAlert("Please login to access the dashboard", "warning");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    }

  }, [user]);

  /* Fetch Vehicle Details */

  useEffect(() => {

    if (!user) return;

    async function fetchVehicle(){

      try{

        const res = await fetch(
          `http://localhost:5000/api/vehicles/${user.id}`
        );

        const data = await res.json();

        setVehicleNumber(data.vehicle.vehicleNumber);

      }catch(err){

        console.log("Vehicle fetch error:",err);

      }

    }

    fetchVehicle();

  },[user]);


  /* Fetch Telemetry Every 10s */

  useEffect(()=>{

    if(!vehicleNumber) return;

    let interval;

    async function fetchTelemetry(){

      try{

        const res = await fetch(
          `http://localhost:5000/api/telemetry/latest/${vehicleNumber}`
        );

        const data = await res.json();

        console.log("Telemetry:",data);

        setTelemetry(data);

      }catch(err){

        console.log("Telemetry fetch error:",err);

      }

    }

    fetchTelemetry();

    interval = setInterval(fetchTelemetry,10000);

    return ()=>clearInterval(interval);

  },[vehicleNumber]);


  if(!telemetry){

    return(
      <HeroSection>

        {alert && (
          <CustomAlert
            message={alert.message}
            type={alert.type}
            onClose={closeAlert}
          />
        )}

        <div className="flex justify-center items-center h-full text-white text-xl">
          Loading telemetry...
        </div>

      </HeroSection>
    );

  }


  return(

  <HeroSection>

    {/* ALERT */}
    {alert && (
      <CustomAlert
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    )}

    <div className="px-4 sm:px-6 md:px-10 py-6 text-white space-y-8">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold"
        >
          DriveIQ
        </Link>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Predictive Vehicle AI
        </h1>

      </div>


      {/* Vehicle Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-black/50 p-4 sm:p-6 rounded-xl backdrop-blur-md">

          <h2 className="text-lg sm:text-xl">Failure Probability</h2>

          <p className="text-3xl sm:text-4xl text-yellow-400 font-bold">
            {(telemetry.failure_probability*100).toFixed(1)}%
          </p>

        </div>


        <div className="bg-black/50 p-4 sm:p-6 rounded-xl backdrop-blur-md">

          <h2 className="text-lg sm:text-xl">Vehicle Number</h2>

          <p className="text-base sm:text-lg">
            {telemetry.vehicleNumber}
          </p>

        </div>


        <div className="bg-black/50 p-4 sm:p-6 rounded-xl backdrop-blur-md">

          <h2 className="text-lg sm:text-xl">Last Update</h2>

          <p className="text-sm sm:text-base">
            {new Date(telemetry.createdAt).toLocaleTimeString()}
          </p>

        </div>

      </div>


      {/* Telemetry */}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

        <div className="bg-black/50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
          Air Temp: {telemetry.air_temp.toFixed(2)} K
        </div>

        <div className="bg-black/50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
          Process Temp: {telemetry.process_temp.toFixed(2)} K
        </div>

        <div className="bg-black/50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
          RPM: {telemetry.rpm.toFixed(2)}
        </div>

        <div className="bg-black/50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
          Torque: {telemetry.torque.toFixed(2)}
        </div>

      </div>


      {/* Tool Wear */}

      <div className="bg-black/50 p-4 sm:p-6 rounded-xl">

        <h2 className="text-lg sm:text-xl mb-2 sm:mb-4">
          Tool Wear Monitoring
        </h2>

        <p className="text-sm sm:text-base">

          Current Tool Wear:

          <span className="text-yellow-400 ml-2 font-semibold">
            {telemetry.tool_wear.toFixed(2)} min
          </span>

        </p>

      </div>


      {/* Predictive Alert */}

      <div className="bg-black/60 p-4 sm:p-6 rounded-xl border border-yellow-400">

        <h2 className="text-lg sm:text-xl text-yellow-400">
          AI Predictive Alert
        </h2>

        <p className="mt-2 text-sm sm:text-base">
          AI is continuously monitoring vehicle telemetry
          and detecting potential mechanical failures.
        </p>

        <p className="mt-2 text-sm sm:text-base">

          Failure Probability:

          <span className="text-yellow-400 ml-2 font-bold">
            {(telemetry.failure_probability*100).toFixed(2)}%
          </span>

        </p>


        <Link to="/service-map">

          <button

            className={`mt-4 sm:mt-6 w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold
            bg-yellow-400 text-black transition-all duration-300

            ${telemetry.failure_probability > 0.5
              ? "shadow-[0_0_30px_rgba(250,204,21,0.9)] animate-pulse scale-105"
              : "shadow-md hover:scale-105"
            }`}

          >

            Schedule Service Now

          </button>

        </Link>

      </div>

    </div>

  </HeroSection>

);

};

export default PredictAI;