import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = ({ darkMode = false }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`max-w-md p-8 rounded-lg shadow-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-center mb-6">
          <AlertTriangle size={80} className="text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center justify-center px-6 py-3 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home size={18} className="mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 