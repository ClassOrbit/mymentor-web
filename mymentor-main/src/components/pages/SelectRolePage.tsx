import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const SelectRolePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = async (role: 'STUDENT' | 'TEACHER') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: role.toLowerCase() })
        .eq('id', user.id); 

      if (error) throw error;
      
      navigate('/dashboard'); 

      window.location.reload(); 
    } catch (error) {
      console.error('Error setting role:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="p-10 bg-gray-800 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-6">One last step...</h1>
        <p className="text-lg mb-8">Are you a student or a teacher?</p>
        <div className="flex gap-4">
          <button
            onClick={() => handleRoleSelect('STUDENT')}
            className="flex-1 px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I'm a Student
          </button>
          <button
            onClick={() => handleRoleSelect('TEACHER')}
            className="flex-1 px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            I'm a Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;