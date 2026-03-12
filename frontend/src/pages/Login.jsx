import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import useAlert from "../hooks/useAlert";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

export default function Login() {

  const { alert, showAlert, closeAlert } = useAlert();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleLogin = async () => {

    try {

      setLoading(true);

      console.log("Logging in with:", formData);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        showAlert(data.message || "Login failed", "error");
        return;
      }

      /* Store user in Redux */
      dispatch(loginSuccess({
        user: data.user,
        role: data.user.role
      }));

      showAlert("Login Successful 🚗", "success");

      setTimeout(() => {
        if (data.user.role === "owner") {
          navigate("/predictive-ai");
        } else if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        }else{
          navigate("/service-dashboard");
        }
      }, 1000);

    } catch (error) {

      console.error("Login error:", error);
      setLoading(false);
      showAlert("Login failed. Please try again.", "error");

    }

  };

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

      <div className="flex items-center justify-center h-full px-4">

        <div className="bg-black/70 p-8 md:p-10 rounded-xl w-full max-w-md text-white">

          <h2 className="text-2xl mb-6 text-center font-semibold">
            Login
          </h2>

          <input
            className="input mb-4"
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="input mb-6"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 rounded font-semibold hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
         {/* CREATE ACCOUNT LINK */}

    <p className="mt-6 text-center text-gray-300 text-sm">

      Don't have an account?{" "}

      <Link
        to="/select-role"
        className="text-yellow-400 font-semibold hover:text-yellow-300 transition"
      >
        Create one
      </Link>

    </p>
        </div>

      </div>

    </HeroSection>
  );
}