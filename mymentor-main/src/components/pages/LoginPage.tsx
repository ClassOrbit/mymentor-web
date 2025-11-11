import React from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-10 bg-gray-800 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          My Mentor
        </h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg 
                     font-semibold text-lg hover:bg-blue-700 
                     transition-colors flex items-center justify-center gap-3"
        >
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;