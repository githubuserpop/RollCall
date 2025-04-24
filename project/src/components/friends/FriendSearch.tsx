import React, { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import Input from '../ui/Input';
import { useFriends } from '../../context/FriendContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const FriendSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { searchUsers, sendFriendRequest, friends } = useFriends();
  const { user } = useAuth();
  
  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchResults = searchUsers(query);
      
      // Filter out current user and existing friends
      const filteredResults = searchResults.filter(
        (result) => 
          result.id !== user?.id && 
          !friends.some((friend) => friend.id === result.id)
      );
      
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, searchUsers, user, friends]);
  
  const handleSendRequest = (userId: string) => {
    sendFriendRequest(userId);
    // Remove from results
    setResults(results.filter(result => result.id !== userId));
  };
  
  return (
    <div className="mb-4">
      <Input
        placeholder="Search for friends"
        icon={<Search size={18} />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-2"
      />
      
      {results.length > 0 && (
        <div className="mt-2 border rounded-md divide-y">
          {results.map((result) => (
            <div 
              key={result.id} 
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center">
                <Avatar
                  src={result.avatar}
                  alt={result.username}
                  size="sm"
                  className="mr-3"
                />
                <div>
                  <p className="text-sm font-medium">{result.username}</p>
                  <p className="text-xs text-gray-500">{result.email}</p>
                </div>
              </div>
              <Button
                variant="text"
                onClick={() => handleSendRequest(result.id)}
                icon={<UserPlus size={18} />}
              />
            </div>
          ))}
        </div>
      )}
      
      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">No results found</p>
      )}
    </div>
  );
};

export default FriendSearch;