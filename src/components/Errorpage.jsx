
import React from "react";
import { Link } from "react-router-dom";
import { House, Frown } from "lucide-react"; 

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      <div className="text-center max-w-lg">
        <Frown className="w-20 h-20 text-indigo-500 mx-auto mb-6" />
        
        <h1 className="text-8xl md:text-9xl font-extrabold text-gray-200">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          Page Not Found
        </h2>
        
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          We're sorry, but the page you were looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Back button*/}
        <Link
          to="/" 
          className="inline-flex items-center mt-8 px-6 py-3 text-white font-semibold text-base rounded-full shadow-lg transition duration-300 transform hover:scale-105 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          <House className="w-5 h-5 mr-2" /> 
          Go to Homepage
        </Link>

        <p className="mt-6 text-sm text-gray-400">
            If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;