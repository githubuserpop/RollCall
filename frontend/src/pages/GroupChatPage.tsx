import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useGroups } from '../context/GroupContext';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { Users } from 'lucide-react';

const GroupChatPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { getGroupById } = useGroups();
  const { getGroupChat, sendMessage } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const group = groupId ? getGroupById(groupId) : undefined;
  const chat = groupId ? getGroupChat(groupId) : undefined;
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);
  
  if (!group) {
    return (
      <MainLayout title="Group Not Found" showBackButton>
        <div className="p-4 text-center">
          <p className="text-gray-600">This group doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }
  
  const handleSendMessage = (content: string) => {
    if (!user || !groupId) return;
    
    sendMessage(groupId, content, user.id);
  };
  
  const handleShowMembers = () => {
    navigate(`/groups/${groupId}`);
  };
  
  const rightElement = (
    <button
      onClick={handleShowMembers}
      className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Users size={20} />
    </button>
  );
  
  return (
    <MainLayout 
      title={group.name} 
      showBackButton 
      rightElement={rightElement}
      hideNavigation
    >
      <div className="flex flex-col h-[calc(100vh-56px)]">
        <div className="flex-1 overflow-y-auto p-4">
          {chat && chat.messages.length > 0 ? (
            <div className="space-y-1">
              {chat.messages.map((message, index) => {
                // Check if the previous message is from the same sender
                const prevMessage = index > 0 ? chat.messages[index - 1] : null;
                const showAvatar = !prevMessage || prevMessage.sender !== message.sender;
                
                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    showAvatar={showAvatar}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">Start the conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </MainLayout>
  );
};

export default GroupChatPage;