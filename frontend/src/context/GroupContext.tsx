import { createContext, useContext, useState, ReactNode } from 'react';
import { Group, Poll, User } from '../types';
import { groups as initialGroups, polls as initialPolls } from '../data/mockData';

interface GroupContextType {
  groups: Group[];
  createGroup: (name: string, description: string, members: User[]) => void;
  updateGroup: (groupId: string, groupData: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  addMemberToGroup: (groupId: string, userId: string) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'status'>) => void;
  votePoll: (pollId: string, optionId: string, userId: string) => void;
  getGroupById: (groupId: string) => Group | undefined;
  getPollById: (pollId: string) => Poll | undefined;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [polls, setPolls] = useState<Poll[]>(initialPolls);

  // Helper to update polls in both state variables
  const updatePolls = (newPoll: Poll) => {
    setPolls(prevPolls => {
      const pollIndex = prevPolls.findIndex(p => p.id === newPoll.id);
      if (pollIndex >= 0) {
        const updatedPolls = [...prevPolls];
        updatedPolls[pollIndex] = newPoll;
        return updatedPolls;
      }
      return [...prevPolls, newPoll];
    });

    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.id === newPoll.groupId) {
          const pollIndex = group.polls.findIndex(p => p.id === newPoll.id);
          if (pollIndex >= 0) {
            const updatedPolls = [...group.polls];
            updatedPolls[pollIndex] = newPoll;
            return { ...group, polls: updatedPolls };
          }
          return { ...group, polls: [...group.polls, newPoll] };
        }
        return group;
      });
    });
  };

  const createGroup = (name: string, description: string, members: User[]) => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      description,
      avatar: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150',
      members,
      polls: [],
      createdAt: new Date().toISOString(),
      createdBy: members[0].id,
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroup = (groupId: string, groupData: Partial<Group>) => {
    setGroups(
      groups.map(group => (group.id === groupId ? { ...group, ...groupData } : group))
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    setPolls(polls.filter(poll => poll.groupId !== groupId));
  };

  const addMemberToGroup = (groupId: string, userId: string) => {
    setGroups(
      groups.map(group => {
        if (group.id === groupId) {
          const user = initialGroups
            .flatMap(g => g.members)
            .find(member => member.id === userId);
          
          if (user && !group.members.some(member => member.id === userId)) {
            return { ...group, members: [...group.members, user] };
          }
        }
        return group;
      })
    );
  };

  const removeMemberFromGroup = (groupId: string, userId: string) => {
    setGroups(
      groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter(member => member.id !== userId),
          };
        }
        return group;
      })
    );
  };

  const createPoll = async (pollData: Omit<Poll, 'id' | 'createdAt' | 'status'>) => {
    try {
      // Make an actual API call to the backend
      console.log('Creating poll with data:', pollData);
      console.log('User creating poll:', pollData.createdBy);
      
      const response = await fetch(`http://localhost:5001/api/groups/${pollData.groupId}/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: pollData.title,
          options: pollData.options.map(opt => opt.text),
          creator_id: pollData.createdBy,
          expire_days: 7 // Default expiration
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create poll');
      }
      
      const data = await response.json();
      
      // Map the response data to our frontend Poll format
      const newPoll: Poll = {
        id: data.id,
        title: data.question,
        description: pollData.description || '',
        options: data.options.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
          votes: opt.votes || []
        })),
        createdBy: data.creator_id,
        groupId: data.group_id,
        createdAt: data.created_at,
        deadline: data.expire_at,
        status: data.active ? 'active' : 'closed',
        isPrivate: pollData.isPrivate || false
      };
      
      // Update the local state with the new poll from backend
      updatePolls(newPoll);
      
      return newPoll;
    } catch (error) {
      console.error('Error creating poll:', error);
      throw error;
    }
  };

  const votePoll = (pollId: string, optionId: string, userId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    // Remove user's vote from any other option first
    const updatedOptions = poll.options.map(option => {
      if (option.id === optionId) {
        // Add vote to this option if not already there
        if (!option.votes.includes(userId)) {
          return { ...option, votes: [...option.votes, userId] };
        }
      } else {
        // Remove vote from other options
        return { ...option, votes: option.votes.filter(id => id !== userId) };
      }
      return option;
    });

    const updatedPoll = { ...poll, options: updatedOptions };
    updatePolls(updatedPoll);
  };

  const getGroupById = (groupId: string) => {
    return groups.find(group => group.id === groupId);
  };

  const getPollById = (pollId: string) => {
    return polls.find(poll => poll.id === pollId);
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        createGroup,
        updateGroup,
        deleteGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        createPoll,
        votePoll,
        getGroupById,
        getPollById,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
};