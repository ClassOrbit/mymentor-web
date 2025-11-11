import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-2xl font-semibold animate-pulse">
        Loading My Mentor...
      </div>
    </div>
  );
};

export default LoadingPage;