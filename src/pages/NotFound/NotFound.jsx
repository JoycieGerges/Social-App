import React from "react";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-400 opacity-20 select-none">
          404
        </h1>
        <p className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-bold text-slate-800">
          Oops! Page Not Found
        </p>
      </div>

      <div className="max-w-md mb-10">
        <p className="text-[#6a7282] text-lg font-normal">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
        <Button
          onPress={() => navigate(-1)}
          variant="bordered"
          className="border-gray-300 text-[#364153] font-medium h-12 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-all"
        >
          <FaArrowLeft className="text-sm" /> Go Back
        </Button>

        <Button
          onPress={() => navigate("/")}
          className="bg-linear-to-r from-blue-600 to-cyan-400 text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-200 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <FaHome /> Back to Home
        </Button>
      </div>

      <div className="fixed top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-50 -z-10"></div>
    </div>
  );
}
