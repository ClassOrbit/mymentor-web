import React from 'react';
import MainLayout from '../../layout/MainLayout';

const Classrooms: React.FC = () => {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold">Manage Classrooms</h1>

      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          window.location.href = '/dashboard';
        }}
      >
        Go to dashboard
      </button>
    </MainLayout>
  );
};

export default Classrooms;