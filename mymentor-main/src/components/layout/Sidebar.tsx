import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LuLayoutDashboard, 
  LuBook, 
  LuBrainCircuit, 
  LuUpload, 
  LuClipboardCheck, 
  LuUsers 
} from 'react-icons/lu';

type NavLinkItem = {
  to: string;
  icon: React.ElementType;
  label: string;
};

//links for each role
const studentLinks: NavLinkItem[] = [
  { to: '/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
  { to: '/subjects', icon: LuBook, label: 'Subjects' },
  { to: '/my-agents', icon: LuBrainCircuit, label: 'My AI Agents' },
  { to: '/assignments', icon: LuClipboardCheck, label: 'Assignments' },
];

const teacherLinks: NavLinkItem[] = [
  { to: '/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
  { to: '/classrooms', icon: LuUsers, label: 'Classrooms' },
  { to: '/upload', icon: LuUpload, label: 'Upload Resources' },
  { to: '/review', icon: LuClipboardCheck, label: 'Review Work' },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  //reusable link component
  const LinkItem: React.FC<NavLinkItem> = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white hover:bg-gray-700
         ${isActive ? 'bg-gray-800 text-white' : ''}`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );

  return (
    <div className="hidden border-r border-gray-700 bg-gray-900 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-gray-700 px-6">
          <span className="text-xl font-bold text-white">My Mentor</span>
        </div>
        <nav className="flex-1 overflow-auto p-4 grid items-start gap-1">
          {links.map((link) => (
            <LinkItem key={link.to} {...link} />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;