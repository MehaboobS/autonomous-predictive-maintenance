import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import useAlert from "../hooks/useAlert";
import Loader from "../components/Loader";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function OwnerRegistrationForm() {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { alert, showAlert, closeAlert } = useAlert();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    if (!formData.password || formData.password.length < 8) {
      showAlert("Password must be at least 8 characters long", "warning");
      return;
    }

    try {

      setLoading(true);

      console.log("Registering with:", formData);

      const response = await fetch(
        `${BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            role: "owner"
          })
        }
      );

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        showAlert(data.message || "Registration failed", "error");
        return;
      }

      showAlert(data.message || "Registration Successful 🚗", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      console.error(error);
      setLoading(false);
      showAlert("Something went wrong", "error");

    }

  };

  return (

    <div className="max-w-3xl mx-auto p-4">

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          className="input-style"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="password"
          placeholder="Password"
          type="password"
          minLength={8}
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="city"
          placeholder="City"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="vehicleNumber"
          placeholder="Vehicle Number"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="manufacturer"
          placeholder="Manufacturer"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="model"
          placeholder="Model"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="year"
          placeholder="Year"
          type="number"
          onChange={handleChange}
        />

        <input
          className="input-style"
          name="mileage"
          placeholder="Current Mileage"
          type="number"
          onChange={handleChange}
        />

      </div>

      <div className="flex justify-center mt-6">

        <button
          onClick={handleSubmit}
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 w-full md:w-auto"
        >
          Register Vehicle
        </button>

      </div>

    </div>
  );
}