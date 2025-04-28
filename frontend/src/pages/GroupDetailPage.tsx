import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useGroups } from '../context/GroupContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'lucide-react';
import PollCard from '../components/polls/PollCard';
import MembersList from '../components/groups/MembersList';
import Button from '../components/ui/Button';
import { Plus, MessageCircle } from 'lucide-react';

const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { getGroupById, removeMemberFromGroup } = useGroups();
  const [activeTab, setActiveTab] = useState<'polls' | 'members'>('polls');
  
  const group = groupId ? getGroupById(groupId) : undefined;
  
  if (!group) {
    return (
      <MainLayout title="Group Not Found" showBackButton>
        <div className="p-4 text-center">
          <p className="text-gray-600">This group doesn't exist.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/groups')}
            className="mt-4"
          >
            Back to Groups
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const handleRemoveMember = (userId: string) => {
    if (groupId) {
      removeMemberFromGroup(groupId, userId);
    }
  };
  
  const handlePollClick = (pollId: string) => {
    navigate(`/polls/${pollId}`);
  };
  
  const handleCreatePoll = () => {
    navigate(`/groups/${groupId}/create-poll`);
  };
  
  const rightElement = (
    <button
      onClick={() => navigate(`/groups/${groupId}/chat`)}
      className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
    >
      <MessageCircle size={20} />
    </button>
  );
  
  return (
    <MainLayout title={group.name} showBackButton rightElement={rightElement}>
      <div className="px-4 py-4">
        {group.description && (
          <p className="text-gray-600 mb-4">{group.description}</p>
        )}
        
        <div className="mb-4 border-b">
          <div className="flex">
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'polls'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('polls')}
            >
              Polls
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'members'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('members')}
            >
              Members ({group.members.length})
            </button>
          </div>
        </div>
        
        {activeTab === 'polls' && (
          <div>
            {group.polls.length > 0 ? (
              <div className="space-y-4">
                {group.polls.map(poll => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    onClick={() => handlePollClick(poll.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No polls in this group yet</p>
                <Button 
                  variant="primary" 
                  onClick={handleCreatePoll}
                  icon={<Plus size={16} />}
                >
                  Create Poll
                </Button>
              </div>
            )}
            
            <div className="fixed bottom-20 right-4">
              <button
                onClick={handleCreatePoll}
                className="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'members' && (
          <MembersList
            members={group.members}
            creatorId={group.createdBy}
            onRemoveMember={handleRemoveMember}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default GroupDetailPage;