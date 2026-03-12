import React from "react";
import { RefreshCw } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

      <div className="flex flex-col items-center">

        {/* Spinning Arrow */}
        <RefreshCw
          size={70}
          className="text-yellow-400 animate-spin"
        />

        <p className="text-yellow-400 mt-4 text-lg font-semibold">
          Loading...
        </p>

      </div>

    </div>
  );
}