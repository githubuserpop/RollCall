import React from 'react';
import { Message, User } from '../../types';
import { formatMessageTime } from '../../utils/formatters';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../data/mockData';

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  showAvatar = true,
}) => {
  const { user: currentUser } = useAuth();
  const isSender = currentUser && message.sender === currentUser.id;
  
  // Find the sender from the users list
  const sender = users.find(u => u.id === message.sender) || {
    id: message.sender,
    username: 'Unknown',
    avatar: 'https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg?auto=compress&cs=tinysrgb&w=150',
    email: '',
    isOnline: false,
  };
  
  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isSender && showAvatar && (
        <Avatar
          src={sender.avatar}
          alt={sender.username}
          size="sm"
          className="mr-2 mt-1"
        />
      )}
      
      <div className={`max-w-[80%] ${!isSender && !showAvatar ? 'ml-8' : ''}`}>
        {!isSender && (
          <p className="text-xs text-gray-500 mb-1">{sender.username}</p>
        )}
        
        <div className="flex flex-col">
          <div
            className={`px-3 py-2 rounded-lg ${
              isSender
                ? 'bg-purple-600 text-white rounded-tr-none'
                : 'bg-gray-200 text-gray-800 rounded-tl-none'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          
          <span
            className={`text-xs text-gray-500 mt-1 ${
              isSender ? 'text-right' : 'text-left'
            }`}
          >
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;