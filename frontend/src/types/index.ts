export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  isOnline: boolean;
}

export interface Friend extends User {
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar: string;
  members: User[];
  polls: Poll[];
  createdAt: string;
  createdBy: string;
}

export interface PollOption {
  id: string;
  text: string;
  image?: string;
  votes: string[]; // Array of user IDs who voted for this option
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  createdBy: string;
  groupId: string;
  deadline: string;
  isPrivate: boolean;
  createdAt: string;
  status: 'active' | 'closed';
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  reactions?: {
    [key: string]: string[]; // Emoji as key, array of user IDs as value
  };
  pollId?: string; // Optional, if the message is related to a poll
}

export interface Chat {
  id: string;
  groupId: string;
  messages: Message[];
}

export interface Notification {
  id: string;
  type: 'poll' | 'chat' | 'friend' | 'group';
  message: string;
  read: boolean;
  timestamp: string;
  relatedId: string; // ID of the related entity (poll, message, friend, group)
}