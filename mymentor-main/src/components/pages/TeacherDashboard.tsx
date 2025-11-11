import React from 'react';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import DashboardCard from '../Dashboard/DashboardCard';
import { LuUsers, LuUpload, LuClipboardCheck } from 'react-icons/lu';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="p-8 bg-gray-900 min-h-screen text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Teacher Dashboard
          </h1>
        </div>

        <p className="text-xl">Welcome back, {user?.name}!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            to="/classrooms"
            icon={LuUsers}
            title="Manage Classrooms"
            description="Monitor student engagement, track attendance, and manage your subjects."
            iconBgColor="bg-indigo-600"
          />
          <DashboardCard
            to="/upload"
            icon={LuUpload}
            title="Upload Resources"
            description="Upload class notes (PDF, TXT) to train and update your subject AI mentors."
            iconBgColor="bg-purple-600"
          />
          <DashboardCard
            to="/review"
            icon={LuClipboardCheck}
            title="Review Work"
            description="View and grade all submitted assignments and research work from your students."
            iconBgColor="bg-pink-600"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;