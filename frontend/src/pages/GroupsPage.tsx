import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import GroupCard from '../components/groups/GroupCard';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { useGroups } from '../context/GroupContext';
import GroupFormModal from '../components/groups/GroupFormModal';

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { groups } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };
  
  return (
    <MainLayout title="Your Groups">
      <div className="px-4 py-4">
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon={<Plus size={16} />}
          className="mb-6"
          fullWidth
        >
          Create New Group
        </Button>
        
        {groups.length > 0 ? (
          <div className="space-y-4">
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => handleGroupClick(group.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <Plus size={24} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No groups yet</h3>
            <p className="text-sm text-gray-500">
              Create your first group to start polling with friends
            </p>
          </div>
        )}
      </div>
      
      {showCreateModal && (
        <GroupFormModal onClose={() => setShowCreateModal(false)} />
      )}
    </MainLayout>
  );
};

export default GroupsPage;