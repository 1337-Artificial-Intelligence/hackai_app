import React from 'react';
import { Link } from 'react-router-dom';
import { BackgroundBeams } from "../components/ui/background-beams";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="text-center z-10">
        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Go back home
        </Link>
      </div>
      <BackgroundBeams />
    </div>
  );
}
