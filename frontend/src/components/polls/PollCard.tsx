import React from 'react';
import { Poll, User } from '../../types';
import { formatPollDeadline, formatPollResults, calculateTimeRemaining } from '../../utils/formatters';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { Clock, Users, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGroups } from '../../context/GroupContext';
import { motion } from 'framer-motion';

interface PollCardProps {
  poll: Poll;
  onClick?: () => void;
  group?: {
    id: string;
    name: string;
  };
}

const PollCard: React.FC<PollCardProps> = ({ poll, onClick, group }) => {
  const { user } = useAuth();
  const { getGroupById } = useGroups();
  
  const pollGroup = group || getGroupById(poll.groupId);
  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes.length, 0);
  const hasVoted = user ? poll.options.some(option => option.votes.includes(user.id)) : false;
  const timeRemaining = calculateTimeRemaining(poll.deadline);
  const isExpired = timeRemaining === 'Expired';
  
  const progressVariants = {
    initial: { width: 0 },
    animate: (percent: number) => ({
      width: `${percent}%`,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {/* Creator avatar */}
            <Avatar 
              src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`} 
              alt="User" 
              size="sm"
              className="mr-2"
            />
            
            <div>
              <p className="text-sm font-medium text-gray-900">@johndoe</p>
              {pollGroup && (
                <p className="text-xs text-gray-500">{pollGroup.name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {poll.isPrivate && (
              <span className="text-gray-500">
                <Lock size={14} />
              </span>
            )}
            
            <Badge 
              variant={isExpired ? 'error' : 'primary'} 
              size="sm"
            >
              {isExpired ? 'Closed' : 'Active'}
            </Badge>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{poll.title}</h3>
        {poll.description && (
          <p className="text-sm text-gray-600 mb-3">{poll.description}</p>
        )}
        
        <div className="space-y-3 mb-4">
          {poll.options.map((option) => {
            const { percent, count } = formatPollResults(option.votes, totalVotes);
            const userVoted = user && option.votes.includes(user.id);
            
            return (
              <div key={option.id} className="relative">
                <div 
                  className={`relative z-10 flex justify-between items-center p-2 border ${userVoted ? 'border-purple-300 bg-purple-50' : 'border-gray-200'} rounded-md`}
                >
                  <span className="font-medium text-sm">{option.text}</span>
                  <span className="text-sm text-gray-600">{count} votes</span>
                </div>
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-purple-100 rounded-md"
                  style={{ zIndex: 5 }}
                  variants={progressVariants}
                  initial="initial"
                  animate="animate"
                  custom={percent}
                />
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>
              {isExpired ? 'Ended ' : ''}{formatPollDeadline(poll.deadline)}
            </span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{totalVotes} votes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PollCard;