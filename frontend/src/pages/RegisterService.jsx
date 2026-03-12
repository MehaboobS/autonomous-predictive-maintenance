import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import CustomAlert from "../components/CustomAlert";
import useAlert from "../hooks/useAlert";

export default function RegisterService() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { alert, showAlert, closeAlert } = useAlert();

  const [formData, setFormData] = useState({
    center: "",
    owner: "",
    email: "",
    password: "",
    city: "",
    pincode: "",
    mechanics: "",
    role: "service"
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async () => {

    // Password validation
    if (!formData.password || formData.password.length < 8) {
      showAlert("Password must be at least 8 characters long", "warning");
      return;
    }

    try {

      console.log("Registering with:", formData);

      const response = await fetch(
        "http://localhost:5000/api/services/register-service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || "Registration failed", "error");
        return;
      }

      showAlert("Service Provider Registered Successfully 🚗", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      console.log("Registered:", data);

    } catch (error) {

      console.error("Registration error:", error);
      showAlert("Something went wrong", "error");

    }

  };

  return (

    <HeroSection>

      {/* ALERT COMPONENT */}
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={closeAlert}
        />
      )}

      <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">

        <div className="bg-black/70 p-6 md:p-10 rounded-xl w-full max-w-lg">

          <h1 className="text-2xl md:text-3xl mb-8 text-center font-semibold">
            Service Center Registration
          </h1>

          <div className="space-y-4">

            <input
              className="input-style"
              name="center"
              placeholder="Service Center Name"
              onChange={handleChange}
            />

            <input
              className="input-style"
              name="owner"
              placeholder="Owner Name"
              onChange={handleChange}
            />

            <input
              className="input-style"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              className="input-style"
              name="password"
              type="password"
              placeholder="Password (min 8 characters)"
              minLength={8}
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
              name="pincode"
              type="number"
              placeholder="Pincode"
              onChange={handleChange}
            />

            <input
              className="input-style"
              name="mechanics"
              placeholder="Mechanics Available"
              type="number"
              onChange={handleChange}
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Register Service Center
            </button>

          </div>

        </div>

      </div>

    </HeroSection>

  );
}