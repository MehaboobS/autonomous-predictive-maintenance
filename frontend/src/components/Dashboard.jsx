import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import dataFile from "../data/data.json";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const Dashboard = () => {

  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const user = useSelector((state) => state.auth.user);
  console.log("Logged in user:", user.id);
  useEffect(() => {
    setData(dataFile);
    fetch(`http://localhost:5000/api/vehicles/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {setResult(data);
        console.log("Fetched vehicle data:",data);
         console.log("Fetched vehicle data:", result);})
      .catch((error) => console.error("Error fetching vehicle data:", error));
  }, [user.id]);

  if (!data) return null;

  return (
    <HeroSection>

      <div className="p-10 text-white space-y-8">

         <Link to={'/'} className="text-3xl font-bold">
          AutoSentinal AI
        </Link>

        <h1 className="text-3xl font-bold">
          Vehicle Dashboard
        </h1>

        {/* Vehicle Summary */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-black/50 p-6 rounded-xl">
            <h2 className="text-xl">Health Score</h2>
            <p className="text-4xl text-yellow-400">
              {data.vehicle.healthScore}%
            </p>
          </div>

          <div className="bg-black/50 p-6 rounded-xl">
            <h2 className="text-xl">Risk Level</h2>
            <p className="text-green-400">
              {data.vehicle.riskLevel}
            </p>
          </div>

          <div className="bg-black/50 p-6 rounded-xl">
            <h2 className="text-xl">Next Service</h2>
            <p>{data.vehicle.nextServiceDays} Days</p>
          </div>

        </div>

        {/* Telemetry */}
        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-black/50 p-4 rounded">
            Engine Temp: {data.telemetry.engineTemp}°C
          </div>

          <div className="bg-black/50 p-4 rounded">
            Battery: {data.telemetry.batteryHealth}%
          </div>

          <div className="bg-black/50 p-4 rounded">
            Oil Level: {data.telemetry.oilLevel}%
          </div>

          <div className="bg-black/50 p-4 rounded">
            RPM: {data.telemetry.rpm}
          </div>

        </div>

        {/* Predictive Alert */}

        <div className="bg-black/60 p-6 rounded-xl border border-yellow-400">

          <h2 className="text-xl text-yellow-400">
            Predictive Alert
          </h2>

          <p className="mt-2">
            {data.prediction.issue}
          </p>

          <p>
            Failure Probability: {data.prediction.failureProbability}%
          </p>

          <Link to="/service-map">
            <button
            className="mt-4 px-6 py-3 bg-yellow-400 text-black rounded-lg"
          >
            Schedule Service Now
          </button>
          </Link>

        </div>

        {/* Service Center */}

        <div className="bg-black/50 p-6 rounded-xl">

          <h2 className="text-xl mb-4">
            Nearest Service Center
          </h2>

          {data.serviceCenters.map((center, index) => (
            <div key={index} className="space-y-2">

              <p>{center.name}</p>
              <p>{center.distance}</p>

              <div className="flex gap-4">
                {center.availableSlots.map((slot, i) => (
                  <button
                    key={i}
                    className="px-4 py-2 bg-gray-800 rounded"
                  >
                    {slot}
                  </button>
                ))}
              </div>

            </div>
          ))}

        </div>

      </div>

    </HeroSection>
  );
};

export default Dashboard;