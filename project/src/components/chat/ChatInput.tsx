import React, { useState } from 'react';
import { SendHorizontal, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white border-t p-2 sticky bottom-0"
    >
      <button
        type="button"
        className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
      >
        <Smile size={20} />
      </button>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 p-2 mx-2 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
      />
      
      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-2 rounded-full ${
          message.trim()
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        <SendHorizontal size={20} />
      </button>
    </form>
  );
};

export default ChatInput;