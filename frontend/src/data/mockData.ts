import { User, Friend, Group, Poll, Chat, Notification } from '../types';
import { addDays } from 'date-fns';

// Helper function to create a date string a certain number of days from now
const daysFromNow = (days: number): string => {
  return addDays(new Date(), days).toISOString();
};

// Mock Users
export const currentUser: User = {
  id: 'user-1',
  username: 'johndoe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  bio: 'I love organizing group events!',
  isOnline: true,
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    username: 'janedoe',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=150',
    isOnline: true,
  },
  {
    id: 'user-3',
    username: 'mikebrown',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    isOnline: false,
  },
  {
    id: 'user-4',
    username: 'sarahlee',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    isOnline: true,
  },
  {
    id: 'user-5',
    username: 'alexwong',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    isOnline: false,
  },
];

// Mock Friends
export const friends: Friend[] = [
  {
    ...users[1],
    status: 'accepted',
  },
  {
    ...users[2],
    status: 'accepted',
  },
  {
    ...users[3],
    status: 'pending',
  },
];

// Mock Groups
export const groups: Group[] = [
  {
    id: 'group-1',
    name: 'Movie Night',
    description: 'Weekly movie night with friends',
    avatar: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=150',
    members: [users[0], users[1], users[2]],
    polls: [],
    createdAt: daysFromNow(-7),
    createdBy: users[0].id,
  },
  {
    id: 'group-2',
    name: 'Dinner Club',
    description: 'Monthly dinner at different restaurants',
    avatar: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=150',
    members: [users[0], users[1], users[3], users[4]],
    polls: [],
    createdAt: daysFromNow(-14),
    createdBy: users[1].id,
  },
  {
    id: 'group-3',
    name: 'Game Night',
    description: 'Board games and video games',
    avatar: 'https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg?auto=compress&cs=tinysrgb&w=150',
    members: [users[0], users[2], users[4]],
    polls: [],
    createdAt: daysFromNow(-21),
    createdBy: users[0].id,
  },
];

// Mock Polls
export const polls: Poll[] = [
  {
    id: 'poll-1',
    title: 'What movie should we watch this week?',
    description: 'Vote for this week\'s movie night!',
    options: [
      { id: 'option-1', text: 'The Dark Knight', votes: [users[0].id, users[2].id] },
      { id: 'option-2', text: 'Inception', votes: [users[1].id] },
      { id: 'option-3', text: 'The Shawshank Redemption', votes: [] },
    ],
    createdBy: users[0].id,
    groupId: 'group-1',
    deadline: daysFromNow(2),
    isPrivate: false,
    createdAt: daysFromNow(-2),
    status: 'active',
  },
  {
    id: 'poll-2',
    title: 'Which restaurant for next month?',
    description: 'Vote for our next dinner location',
    options: [
      { id: 'option-1', text: 'Italian Bistro', votes: [users[0].id, users[3].id] },
      { id: 'option-2', text: 'Sushi Bar', votes: [users[1].id] },
      { id: 'option-3', text: 'Steakhouse', votes: [users[4].id] },
    ],
    createdBy: users[1].id,
    groupId: 'group-2',
    deadline: daysFromNow(5),
    isPrivate: false,
    createdAt: daysFromNow(-3),
    status: 'active',
  },
  {
    id: 'poll-3',
    title: 'Game night theme?',
    description: 'Vote for the theme of our next game night',
    options: [
      { id: 'option-1', text: 'Strategy Games', votes: [users[0].id] },
      { id: 'option-2', text: 'Party Games', votes: [users[2].id, users[4].id] },
      { id: 'option-3', text: 'Video Games', votes: [] },
    ],
    createdBy: users[0].id,
    groupId: 'group-3',
    deadline: daysFromNow(3),
    isPrivate: false,
    createdAt: daysFromNow(-1),
    status: 'active',
  },
];

// Add polls to groups
groups[0].polls.push(polls[0]);
groups[1].polls.push(polls[1]);
groups[2].polls.push(polls[2]);

// Mock Chats
export const chats: Chat[] = [
  {
    id: 'chat-1',
    groupId: 'group-1',
    messages: [
      {
        id: 'message-1',
        content: 'Hey everyone, I created a poll for this week\'s movie!',
        sender: users[0].id,
        timestamp: daysFromNow(-2),
        pollId: 'poll-1',
      },
      {
        id: 'message-2',
        content: 'I voted for The Dark Knight!',
        sender: users[2].id,
        timestamp: daysFromNow(-1),
        pollId: 'poll-1',
      },
      {
        id: 'message-3',
        content: 'Inception is my favorite!',
        sender: users[1].id,
        timestamp: daysFromNow(-1),
        pollId: 'poll-1',
      },
    ],
  },
  {
    id: 'chat-2',
    groupId: 'group-2',
    messages: [
      {
        id: 'message-1',
        content: 'I created a poll for next month\'s dinner location!',
        sender: users[1].id,
        timestamp: daysFromNow(-3),
        pollId: 'poll-2',
      },
      {
        id: 'message-2',
        content: 'Italian Bistro has great pasta!',
        sender: users[0].id,
        timestamp: daysFromNow(-2),
        pollId: 'poll-2',
      },
      {
        id: 'message-3',
        content: 'I haven\'t had sushi in a while, so that got my vote!',
        sender: users[1].id,
        timestamp: daysFromNow(-1),
        pollId: 'poll-2',
      },
    ],
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 'notification-1',
    type: 'poll',
    message: 'New poll created in Movie Night: What movie should we watch this week?',
    read: false,
    timestamp: daysFromNow(-2),
    relatedId: 'poll-1',
  },
  {
    id: 'notification-2',
    type: 'chat',
    message: 'New message in Dinner Club from Jane Doe',
    read: true,
    timestamp: daysFromNow(-1),
    relatedId: 'message-3',
  },
  {
    id: 'notification-3',
    type: 'friend',
    message: 'Sarah Lee sent you a friend request',
    read: false,
    timestamp: daysFromNow(0),
    relatedId: users[3].id,
  },
];