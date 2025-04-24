import React from 'react';
import { Group } from '../../types';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import { Users, BarChart } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  onClick?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start">
        <Avatar
          src={group.avatar}
          alt={group.name}
          size="lg"
          className="mr-3 flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
          {group.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{group.description}</p>
          )}
          <div className="flex text-xs text-gray-500 mt-2">
            <div className="flex items-center mr-4">
              <Users size={14} className="mr-1" />
              <span>{group.members.length} members</span>
            </div>
            <div className="flex items-center">
              <BarChart size={14} className="mr-1" />
              <span>{group.polls.length} polls</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;