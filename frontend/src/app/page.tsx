"use client";

import React from "react";
import BookParticles from "./components/BookParticles";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Particle Background */}
      <BookParticles />

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-4xl text-center px-4 sm:px-0">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6 leading-tight">
          PDF Annotation Hub
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          A modern platform to highlight, draw, and collaborate on PDFs
          seamlessly.
        </p>

        <button className="w-full sm:w-auto inline-block px-12 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/50">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
