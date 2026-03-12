import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const OnboardingSection = () => {

  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Typewriter
  const fullText = "Intelligence Behind Every Kilometer.";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {

    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {

      if (!isDeleting && displayText.length < fullText.length) {
        setDisplayText(fullText.substring(0, displayText.length + 1));
      } 
      
      else if (!isDeleting && displayText.length === fullText.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } 
      
      else if (isDeleting && displayText.length > 0) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
      } 
      
      else if (isDeleting && displayText.length === 0) {
        setIsDeleting(false);
      }

    }, typingSpeed);

    return () => clearTimeout(timeout);

  }, [displayText, isDeleting]);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="absolute top-0 left-0 w-full z-20
        flex items-center justify-between px-6 md:px-16 py-5
        text-white backdrop-blur-md bg-black/20"
      >
        <h1 className="text-2xl font-bold tracking-wide">
          DriveIQ
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-medium">

          {/* <Link to="/dashboard" className="hover:text-yellow-400">
            Dashboard
          </Link> */}

          <Link to="/predictive-ai" className="hover:text-yellow-400">
            Dashboard
          </Link>

          {/* <Link to="/service-scheduling" className="hover:text-yellow-400">
            Service Scheduling
          </Link> */}
{/* 
          <Link to="/manufacturing-insights" className="hover:text-yellow-400">
            Manufacturing Insights
          </Link> */}

          {user ? (
            <button
              onClick={handleLogout}
              className="hover:text-red-400"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-yellow-400">
              Login
            </Link>
          )}

        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">

          <button onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

      </nav>

      {/* MOBILE MENU */}
      {open && (

        <div
          className="md:hidden absolute top-20 left-0 w-full
          bg-black/90 backdrop-blur-md text-white
          flex flex-col items-center space-y-6 py-6 z-10"
        >
          <Link to={user && user.role === "admin" ? "/admin-dashboard" : "/predictive-ai"} className="hover:text-yellow-400" onClick={() => setOpen(false)}>
Admin Dashboard
</Link>

          <Link
            to="/dashboard"
            className="hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            to="/predictive-ai"
            className="hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            Predictive AI
          </Link>

          <Link
            to="/service-scheduling"
            className="hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            Service Scheduling
          </Link>

          <Link
            to="/manufacturing-insights"
            className="hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            Manufacturing Insights
          </Link>

          {user ? (

            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="hover:text-red-400"
            >
              Logout
            </button>

          ) : (

            <Link
              to="/login"
              className="hover:text-yellow-400"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

          )}

        </div>

      )}

      {/* HERO CONTENT */}

      <div className="flex items-center min-h-screen px-6 md:px-20">

        <div className="max-w-2xl text-white">

          <h1 className="text-4xl md:text-6xl font-bold">
            DriveIQ
          </h1>

          <p className="mt-4 text-2xl md:text-3xl text-yellow-400 font-semibold">
            {displayText}
          </p>

          <p className="mt-6 text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
            Autonomous predictive intelligence that prevents failures,
            optimizes service scheduling, and feeds insights back to manufacturing.
          </p>

          <Link
            to="/select-role"
            className="inline-block mt-8 px-8 md:px-10 py-3 md:py-4
            bg-black text-yellow-400 font-semibold rounded-full
            shadow-[0_0_20px_rgba(250,204,21,0.8)]"
          >
            {user ? "Explore the Dashboard" : "Get Started"}
          </Link>

        </div>

      </div>

    </>
  );
};

export default OnboardingSection;