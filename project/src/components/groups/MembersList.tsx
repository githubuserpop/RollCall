import React from 'react';
import { User } from '../../types';
import Avatar from '../ui/Avatar';
import { UserMinus, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MembersListProps {
  members: User[];
  creatorId: string;
  onRemoveMember?: (userId: string) => void;
  className?: string;
}

const MembersList: React.FC<MembersListProps> = ({
  members,
  creatorId,
  onRemoveMember,
  className = '',
}) => {
  const { user } = useAuth();
  
  const isCreator = user && user.id === creatorId;
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Members ({members.length})</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Avatar
                src={member.avatar}
                alt={member.username}
                size="sm"
                showStatus
                isOnline={member.isOnline}
                className="mr-3"
              />
              <div>
                <p className="text-sm font-medium">
                  {member.username}
                  {member.id === creatorId && (
                    <span className="ml-1 text-yellow-500 inline-flex items-center">
                      <Crown size={14} />
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
            </div>
            
            {/* Only show remove button if:
                1. Current user is the creator
                2. The member is not the creator
                3. The member is not the current user */}
            {isCreator && member.id !== creatorId && member.id !== user?.id && onRemoveMember && (
              <button
                onClick={() => onRemoveMember(member.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <UserMinus size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;