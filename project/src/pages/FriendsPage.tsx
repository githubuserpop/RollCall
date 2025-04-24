import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FriendCard from '../components/friends/FriendCard';
import FriendSearch from '../components/friends/FriendSearch';
import { useFriends } from '../context/FriendContext';

const FriendsPage: React.FC = () => {
  const { friends, acceptFriendRequest, rejectFriendRequest, removeFriend } = useFriends();
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  
  const pendingFriends = friends.filter(friend => friend.status === 'pending');
  const acceptedFriends = friends.filter(friend => friend.status === 'accepted');
  
  const displayedFriends = activeTab === 'all' ? acceptedFriends : pendingFriends;
  
  return (
    <MainLayout title="Friends">
      <div className="px-4 py-4">
        <FriendSearch />
        
        <div className="mb-4 border-b">
          <div className="flex">
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'all'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('all')}
            >
              Friends
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === 'pending'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Requests {pendingFriends.length > 0 && `(${pendingFriends.length})`}
            </button>
          </div>
        </div>
        
        {displayedFriends.length > 0 ? (
          <div className="space-y-3">
            {displayedFriends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onAccept={
                  friend.status === 'pending'
                    ? () => acceptFriendRequest(friend.id)
                    : undefined
                }
                onReject={
                  friend.status === 'pending'
                    ? () => rejectFriendRequest(friend.id)
                    : undefined
                }
                onRemove={
                  friend.status === 'accepted'
                    ? () => removeFriend(friend.id)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === 'all'
                ? 'You have no friends yet. Search to add friends!'
                : 'No pending friend requests'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FriendsPage;