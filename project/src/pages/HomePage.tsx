import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PollCard from '../components/polls/PollCard';
import { Plus } from 'lucide-react';
import { useGroups } from '../context/GroupContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { groups } = useGroups();
  const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all');
  
  // Get all polls from all groups
  const allPolls = groups
    .flatMap(group => group.polls)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Filter to show only polls from the last 3 days
  const recentPolls = allPolls.filter(
    poll => new Date(poll.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  );
  
  const displayedPolls = activeTab === 'all' ? allPolls : recentPolls;
  
  const handlePollClick = (pollId: string) => {
    navigate(`/polls/${pollId}`);
  };
  
  const FloatingActionButton = () => (
    <button
      onClick={() => navigate('/create-poll')}
      className="fixed bottom-20 right-4 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center"
    >
      <Plus size={24} />
    </button>
  );
  
  return (
    <MainLayout title="VoteGroup">
      <div className="px-4 py-4">
        <div className="flex mb-4 border-b">
          <button
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Polls
          </button>
          <button
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === 'recent'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </button>
        </div>
        
        {displayedPolls.length > 0 ? (
          <div className="space-y-4">
            {displayedPolls.map(poll => {
              const pollGroup = groups.find(g => g.id === poll.groupId);
              return (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onClick={() => handlePollClick(poll.id)}
                  group={
                    pollGroup
                      ? { id: pollGroup.id, name: pollGroup.name }
                      : undefined
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <Plus size={24} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No polls yet</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Create your first poll by clicking the button below
            </p>
            <button
              onClick={() => navigate('/create-poll')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md"
            >
              Create Poll
            </button>
          </div>
        )}
      </div>
      
      <FloatingActionButton />
    </MainLayout>
  );
};

export default HomePage;