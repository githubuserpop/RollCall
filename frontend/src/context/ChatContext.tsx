import { createContext, useContext, useState, ReactNode } from 'react';
import { Chat, Message } from '../types';
import { chats as initialChats } from '../data/mockData';

interface ChatContextType {
  chats: Chat[];
  getGroupChat: (groupId: string) => Chat | undefined;
  sendMessage: (groupId: string, content: string, senderId: string, pollId?: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>(initialChats);

  const getGroupChat = (groupId: string) => {
    return chats.find(chat => chat.groupId === groupId);
  };

  const sendMessage = (groupId: string, content: string, senderId: string, pollId?: string) => {
    const chat = chats.find(chat => chat.groupId === groupId);
    
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      content,
      sender: senderId,
      timestamp: new Date().toISOString(),
      pollId,
    };
    
    if (chat) {
      setChats(
        chats.map(c => 
          c.id === chat.id
            ? { ...c, messages: [...c.messages, newMessage] }
            : c
        )
      );
    } else {
      // Create a new chat for this group
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        groupId,
        messages: [newMessage],
      };
      setChats([...chats, newChat]);
    }
  };

  const addReaction = (messageId: string, emoji: string, userId: string) => {
    setChats(
      chats.map(chat => ({
        ...chat,
        messages: chat.messages.map(message => {
          if (message.id === messageId) {
            const reactions = message.reactions || {};
            const emojiReactions = reactions[emoji] || [];
            
            if (!emojiReactions.includes(userId)) {
              return {
                ...message,
                reactions: {
                  ...reactions,
                  [emoji]: [...emojiReactions, userId],
                },
              };
            }
          }
          return message;
        }),
      }))
    );
  };

  const removeReaction = (messageId: string, emoji: string, userId: string) => {
    setChats(
      chats.map(chat => ({
        ...chat,
        messages: chat.messages.map(message => {
          if (message.id === messageId && message.reactions && message.reactions[emoji]) {
            const updatedReactions = {
              ...message.reactions,
              [emoji]: message.reactions[emoji].filter(id => id !== userId),
            };
            
            // Remove the emoji key if there are no more reactions
            if (updatedReactions[emoji].length === 0) {
              delete updatedReactions[emoji];
            }
            
            return {
              ...message,
              reactions: updatedReactions,
            };
          }
          return message;
        }),
      }))
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        getGroupChat,
        sendMessage,
        addReaction,
        removeReaction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};