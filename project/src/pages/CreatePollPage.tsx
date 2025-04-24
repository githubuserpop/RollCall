import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PollCreationForm from '../components/polls/PollCreationForm';

const CreatePollPage: React.FC = () => {
  // If this page is accessed via /groups/:groupId/create-poll,
  // we'll have a groupId param
  const { groupId } = useParams<{ groupId?: string }>();
  
  return (
    <MainLayout title="Create Poll" showBackButton>
      <PollCreationForm groupId={groupId} />
    </MainLayout>
  );
};

export default CreatePollPage;