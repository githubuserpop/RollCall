import { createContext, useContext, useState, ReactNode } from 'react';
import { Friend, User } from '../types';
import { friends as initialFriends, users } from '../data/mockData';

interface FriendContextType {
  friends: Friend[];
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (userId: string) => void;
  rejectFriendRequest: (userId: string) => void;
  removeFriend: (userId: string) => void;
  searchUsers: (query: string) => User[];
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);

  const sendFriendRequest = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Check if already in friends list
    if (friends.some(friend => friend.id === userId)) return;
    
    const newFriend: Friend = {
      ...user,
      status: 'pending',
    };
    
    setFriends([...friends, newFriend]);
  };

  const acceptFriendRequest = (userId: string) => {
    setFriends(
      friends.map(friend => 
        friend.id === userId ? { ...friend, status: 'accepted' } : friend
      )
    );
  };

  const rejectFriendRequest = (userId: string) => {
    setFriends(
      friends.map(friend => 
        friend.id === userId ? { ...friend, status: 'rejected' } : friend
      )
    );
  };

  const removeFriend = (userId: string) => {
    setFriends(friends.filter(friend => friend.id !== userId));
  };

  const searchUsers = (query: string) => {
    if (!query.trim()) return [];
    
    return users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <FriendContext.Provider
      value={{
        friends,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        searchUsers,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = (): FriendContextType => {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendProvider');
  }
  return context;
};