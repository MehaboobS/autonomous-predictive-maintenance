import React, { useEffect, useState } from "react";
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

mapboxgl.accessToken = `${MAPBOX_TOKEN}`;

export default function ServiceMap() {

  const user = useSelector((state) => state.auth.user);
  const { alert, showAlert, closeAlert } = useAlert();

  const [loading, setLoading] = useState(false);

  console.log("Logged in user:", user?.id);

  useEffect(() => {

    /* Request Service Function */

    window.requestService = async (providerEmail, center) => {

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

        showAlert(
          data.message || "Service request sent successfully 🚗",
          "success"
        );

      } catch (error) {

        console.error("Request failed:", error);
        setLoading(false);
        showAlert("Service request failed", "error");

      }

    };

    /* Initialize Map */

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716],
      zoom: 11
    });

    map.on("load", async () => {

      try {

        setLoading(true);

        const response = await fetch(`${BASE_URL}/api/services/all`);
        const data = await response.json();

        const providers = data.listServices;

        for (const provider of providers) {

          const geoUrl =
            `https://api.geoapify.com/v1/geocode/search?text=${provider.pincode}&apiKey=${GEO_CODE_API}`;

          const geoResponse = await fetch(geoUrl);
          const geoData = await geoResponse.json();

          if (!geoData.features.length) continue;

          const [lng, lat] =
            geoData.features[0].geometry.coordinates;

          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="popup-box">
                <h3>${provider.center}</h3>

                <button
                  class="popup-btn"
                  onclick="requestService('${provider.email}','${provider.center}')"
                >
                  Request Service
                </button>

              </div>
            `);

          new mapboxgl.Marker({ color: "red" })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map);

        }

        setLoading(false);

      } catch (error) {

        console.error("Error loading services:", error);
        setLoading(false);
        showAlert("Failed to load service centers", "error");

      }

    });

  }, [user]);

  return (

    <HeroSection>

      {/* LOADER */}
      {loading && <Loader />}

      {/* ALERT */}
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
            className="inline-flex items-center gap-2
            text-yellow-400 font-semibold
            hover:text-yellow-300 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* MAP CONTAINER */}

        <div className="relative w-full h-[calc(100vh-120px)] rounded-xl overflow-hidden">

          <div
            id="map"
            className="w-full h-full"
          />

        </div>

      </div>

    </HeroSection>

  );

}