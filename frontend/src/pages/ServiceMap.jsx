import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import HeroSection from "../components/HeroSection";
import "./ServiceMap.css";
import { useSelector } from "react-redux";
import CustomAlert from "../components/CustomAlert";
import useAlert from "../hooks/useAlert";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

/* ENV VARIABLES */

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_URL_API;
const GEO_CODE_API = import.meta.env.VITE_GEO_CODE_API_KEY;
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function ServiceMap() {

  const user = useSelector((state) => state.auth.user);
  const { alert, showAlert, closeAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const mapRef = useRef(null);

  /* REQUEST SERVICE */

  const requestService = async (providerEmail, center) => {

    try {

      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/vehicles/${user.id}`);
      const vehicleData = await res.json();

      const vehicleNumber = vehicleData.vehicle.vehicleNumber;

      const response = await fetch(
        `${BASE_URL}/api/services/request-service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            providerEmail,
            center,
            userEmail: user.email,
            vehicleNumber
          })
        }
      );

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        showAlert(data.message || "Service request failed", "error");
        return;
      }

      showAlert(data.message || "Service request sent successfully 🚗", "success");

    } catch (error) {

      console.error("Request failed:", error);
      setLoading(false);
      showAlert("Service request failed", "error");

    }

  };

  /* VIEW SINGLE PROVIDER ON MAP */

  const viewOnMap = (provider) => {

    if (!mapRef.current) return;

    setShowMap(true);

    mapRef.current.flyTo({
      center: [provider.lng, provider.lat],
      zoom: 14
    });

  };

  /* LOAD MAP AND MARKERS */

  const renderAllProviders = () => {

    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716],
      zoom: 11
    });

    mapRef.current = map;

    map.on("load", () => {

      providers.forEach((provider) => {

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${provider.center}</h3>`);

        new mapboxgl.Marker({ color: "red" })
          .setLngLat([provider.lng, provider.lat])
          .setPopup(popup)
          .addTo(map);

      });

    });

  };

  /* LOAD PROVIDERS */

  useEffect(() => {

    const loadProviders = async () => {

      try {

        setLoading(true);

        const response = await fetch(`${BASE_URL}/api/services/all`);
        const data = await response.json();

        const providersList = data.listServices;

        const updatedProviders = [];

        for (const provider of providersList) {

          const geoUrl =
            `https://api.geoapify.com/v1/geocode/search?text=${provider.pincode}&apiKey=${GEO_CODE_API}`;

          const geoResponse = await fetch(geoUrl);
          const geoData = await geoResponse.json();

          if (!geoData.features.length) continue;

          const [lng, lat] = geoData.features[0].geometry.coordinates;

          updatedProviders.push({
            ...provider,
            lng,
            lat
          });

        }

        setProviders(updatedProviders);
        setLoading(false);

      } catch (error) {

        console.error("Error loading services:", error);
        setLoading(false);
        showAlert("Failed to load service centers", "error");

      }

    };

    loadProviders();

  }, []);

  return (

    <HeroSection>

      {loading && <Loader />}

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={closeAlert}
        />
      )}

      <div className="w-full px-4">

        {/* BACK BUTTON */}

        <div className="mb-4">
          <Link
            to={user.role === "owner" ? "/predictive-ai" : "/service-dashboard"}
            className="text-yellow-400 font-semibold hover:text-yellow-300"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* VIEW MAP BUTTON */}

        <div className="mb-4">

          <button
            onClick={() => {
              setShowMap(true);
              setTimeout(renderAllProviders, 100);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            View Map
          </button>

        </div>

        {/* SERVICE PROVIDERS TABLE */}

        <div className="bg-gray-900 p-4 rounded-xl mb-6">

          <h2 className="text-xl font-bold mb-4 text-yellow-400">
            Service Providers
          </h2>

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-gray-700 text-white">
                <th>Center</th>
                <th>Email</th>
                <th>Pincode</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {providers.map((provider, index) => (

                <tr key={index} className="border-b border-gray-800 text-white">

                  <td>{provider.center}</td>
                  <td>{provider.email}</td>
                  <td>{provider.pincode}</td>

                  <td className="flex gap-2 py-2">

                    {/* <button
                      onClick={() => viewOnMap(provider)}
                      className="bg-blue-500 px-3 py-1 rounded text-white"
                    >
                      View on Map
                    </button> */}

                    <button
                      onClick={() =>
                        requestService(provider.email, provider.center)
                      }
                      className="bg-green-500 px-3 py-1 rounded text-white"
                    >
                      Request Service
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* MAP */}

        {showMap && (

          <div className="relative w-full h-[500px] rounded-xl overflow-hidden">

            <div
              id="map"
              className="w-full h-full"
            />

          </div>

        )}

      </div>

    </HeroSection>

  );

}