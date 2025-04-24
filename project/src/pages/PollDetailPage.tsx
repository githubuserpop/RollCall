import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../../src/context/AuthContext';
import PollResultsChart from '../components/polls/PollResultsChart';
import { Clock, Users, MessageCircle } from 'lucide-react';
import { formatPollDeadline, calculateTimeRemaining } from '../utils/formatters';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

const PollDetailPage: React.FC = () => {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();
  const { getPollById, getGroupById, votePoll } = useGroups();
  const { user } = useAuth();
  
  const poll = pollId ? getPollById(pollId) : undefined;
  const group = poll ? getGroupById(poll.groupId) : undefined;
  
  const [selectedOption, setSelectedOption] = useState<string | null>(() => {
    if (poll && user) {
      const votedOption = poll.options.find(opt => 
        opt.votes.includes(user.id)
      );
      return votedOption ? votedOption.id : null;
    }
    return null;
  });
  
  if (!poll || !group) {
    return (
      <MainLayout title="Poll Not Found" showBackButton>
        <div className="p-4 text-center">
          <p className="text-gray-600">This poll doesn't exist.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Back to Home
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const totalVotes = poll.options.reduce((acc, option) => acc + option.votes.length, 0);
  const hasVoted = user ? poll.options.some(option => option.votes.includes(user.id)) : false;
  const timeRemaining = calculateTimeRemaining(poll.deadline);
  const isExpired = timeRemaining === 'Expired';
  
  const handleVote = (optionId: string) => {
    if (!user || isExpired) return;
    
    setSelectedOption(optionId);
    votePoll(poll.id, optionId, user.id);
  };
  
  const handleGroupClick = () => {
    navigate(`/groups/${group.id}`);
  };
  
  const handleChatClick = () => {
    navigate(`/groups/${group.id}/chat`);
  };
  
  return (
    <MainLayout title="Poll Details" showBackButton>
      <div className="px-4 py-4">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-4">
          <div className="p-4">
            <div 
              className="flex items-center text-sm text-purple-600 mb-3 cursor-pointer"
              onClick={handleGroupClick}
            >
              <Avatar
                src={group.avatar}
                alt={group.name}
                size="sm"
                className="mr-2"
              />
              <span>{group.name}</span>
            </div>
            
            <h1 className="text-xl font-semibold mb-2">{poll.title}</h1>
            {poll.description && (
              <p className="text-gray-600 mb-4">{poll.description}</p>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>
                  {isExpired ? 'Ended ' : ''}{formatPollDeadline(poll.deadline)}
                </span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                <span>{totalVotes} votes</span>
              </div>
            </div>
            
            {!isExpired && !hasVoted && user && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Cast your vote:</h3>
                <div className="space-y-2">
                  {poll.options.map(option => (
                    <button
                      key={option.id}
                      className={`w-full p-3 border rounded-md transition-colors ${
                        selectedOption === option.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                      onClick={() => handleVote(option.id)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <PollResultsChart poll={poll} />
            
            <div className="mt-6 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isExpired 
                    ? 'This poll has ended' 
                    : `Time remaining: ${timeRemaining}`}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleChatClick}
                icon={<MessageCircle size={16} />}
              >
                Discuss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PollDetailPage;