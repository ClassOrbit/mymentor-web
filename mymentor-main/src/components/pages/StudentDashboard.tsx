import React from 'react';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import DashboardCard from '../Dashboard/DashboardCard';
import { LuBook, LuBrainCircuit, LuClipboardCheck } from 'react-icons/lu';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="p-8 bg-gray-900 min-h-screen text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Student Dashboard
          </h1>
        </div>
        
        <p className="text-xl">Welcome back, {user?.name}!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            to="/subjects"
            icon={LuBook}
            title="My Subjects"
            description="Access your virtual classes, notes, and subject-specific AI mentors."
            iconBgColor="bg-blue-600"
          />
          <DashboardCard
            to="/my-agents"
            icon={LuBrainCircuit}
            title="My AI Agents"
            description="Create and manage your own personal AI agents trained on your data."
            iconBgColor="bg-green-600"
          />
          <DashboardCard
            to="/assignments"
            icon={LuClipboardCheck}
            title="Assignments"
            description="View and submit your homework and assignments for all subjects."
            iconBgColor="bg-yellow-600"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;