import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import Loader from "../components/Loader";

const AdminDashboard = () => {

  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);

  const fetchDashboard = async() => {

    try{

      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/admin/dashboard"
      );

      const result = await res.json();

      setData(result);

      setLoading(false);

    }catch(err){

      console.log("Admin fetch error:",err);
      setLoading(false);

    }

  }

  useEffect(()=>{
    fetchDashboard();
  },[]);

  if(loading){
    return <Loader/>
  }

  return(

    <HeroSection>

      <div className="px-4 md:px-10 py-8 text-white space-y-10">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        {/* STATISTICS */}

        {data && (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className="bg-black/50 p-6 rounded-xl backdrop-blur-md">

            <h2 className="text-lg text-yellow-400">
              Total Users
            </h2>

            <p className="text-3xl font-bold">
              {data.totalUsers}
            </p>

          </div>

          <div className="bg-black/50 p-6 rounded-xl backdrop-blur-md">

            <h2 className="text-lg text-yellow-400">
              Service Providers
            </h2>

            <p className="text-3xl font-bold">
              {data.totalProviders}
            </p>

          </div>

          <div className="bg-black/50 p-6 rounded-xl backdrop-blur-md">

            <h2 className="text-lg text-yellow-400">
              Total Requests
            </h2>

            <p className="text-3xl font-bold">
              {data.totalRequests}
            </p>

          </div>

        </div>

        )}


        {/* USERS TABLE */}

        <div className="bg-black/60 p-6 rounded-xl">

          <h2 className="text-xl text-yellow-400 mb-4">
            Users
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-gray-600">

                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">City</th>
                  <th className="p-2">Vehicle</th>

                </tr>

              </thead>

              <tbody>

                {data?.users.map((u,index)=>(

                  <tr key={index} className="border-b border-gray-700">

                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.city}</td>
                    <td className="p-2">
                      {u.vehicle?.vehicleNumber || "N/A"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* SERVICE PROVIDERS */}

        <div className="bg-black/60 p-6 rounded-xl">

          <h2 className="text-xl text-yellow-400 mb-4">
            Service Providers
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-gray-600">

                  <th className="p-2">Center</th>
                  <th className="p-2">Owner</th>
                  <th className="p-2">City</th>
                  <th className="p-2">Mechanics</th>
                  <th className="p-2">Requests</th>

                </tr>

              </thead>

              <tbody>

                {data?.providers.map((p,index)=>(

                  <tr key={index} className="border-b border-gray-700">

                    <td className="p-2">{p.center}</td>
                    <td className="p-2">{p.owner}</td>
                    <td className="p-2">{p.city}</td>
                    <td className="p-2">{p.mechanics}</td>
                    <td className="p-2">
                      {p.serviceRequests.length}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </HeroSection>

  )

}

export default AdminDashboard;