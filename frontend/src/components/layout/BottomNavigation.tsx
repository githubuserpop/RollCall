import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, UserCircle, LayoutGrid } from 'lucide-react';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center py-2 ${
        isActive ? 'text-purple-600' : 'text-gray-500'
      }`}
    >
      <div className="h-6">{icon}</div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-4 h-16">
        <NavItem
          to="/"
          label="Home"
          icon={<Home size={24} className={pathname === '/' ? 'fill-current text-purple-600' : ''} />}
          isActive={pathname === '/'}
        />
        <NavItem
          to="/groups"
          label="Groups"
          icon={<LayoutGrid size={24} className={pathname.startsWith('/groups') ? 'fill-current text-purple-600' : ''} />}
          isActive={pathname.startsWith('/groups')}
        />
        <NavItem
          to="/friends"
          label="Friends"
          icon={<Users size={24} className={pathname.startsWith('/friends') ? 'fill-current text-purple-600' : ''} />}
          isActive={pathname.startsWith('/friends')}
        />
        <NavItem
          to="/profile"
          label="Profile"
          icon={<UserCircle size={24} className={pathname.startsWith('/profile') ? 'fill-current text-purple-600' : ''} />}
          isActive={pathname.startsWith('/profile')}
        />
      </div>
    </div>
  );
};

export default BottomNavigation;