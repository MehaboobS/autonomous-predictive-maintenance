import React from "react";
import bgImage from "../assets/bg.jpg";
import CustomCursor from "./CustomCursor";

const HeroSection = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">

      <CustomCursor />

      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 -z-10"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen pt-24 px-6 md:px-10">
        {children}
      </div>

    </div>
  );
};

export default HeroSection;