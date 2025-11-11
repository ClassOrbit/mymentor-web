import React from 'react';
import { Link } from 'react-router-dom';
import { LuSearchX } from 'react-icons/lu';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <LuSearchX className="h-24 w-24 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-400 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;