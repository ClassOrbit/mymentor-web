import React from 'react';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';

interface DashboardCardProps {
  to: string;
  icon: IconType;
  title: string;
  description: string;
  iconBgColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  to,
  icon: Icon,
  title,
  description,
  iconBgColor = 'bg-blue-600',
}) => {
  return (
    <Link
      to={to}
      className="block p-6 bg-gray-800 rounded-lg shadow-lg 
                 hover:bg-gray-700 transition-all duration-200 
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex flex-col h-full">
        <div
          className={`p-3 w-fit rounded-lg ${iconBgColor}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-1 text-gray-400 text-sm flex-1">{description}</p>
        <div className="mt-4 text-sm font-medium text-blue-400">
          Go to {title} &rarr;
        </div>
      </div>
    </Link>
  );
};

export default DashboardCard;