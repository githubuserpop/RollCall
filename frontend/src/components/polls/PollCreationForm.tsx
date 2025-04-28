import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image, Calendar, Users, X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useGroups } from '../../context/GroupContext';
import { useAuth } from '../../context/AuthContext';
import { addDays } from 'date-fns';

const PollCreationForm: React.FC<{ groupId?: string }> = ({ groupId }) => {
  const navigate = useNavigate();
  const { groups, createPoll } = useGroups();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([
    { id: `option-${Date.now()}-1`, text: '', image: '' },
    { id: `option-${Date.now()}-2`, text: '', image: '' },
  ]);
  const [selectedGroupId, setSelectedGroupId] = useState(groupId || '');
  const [isPrivate, setIsPrivate] = useState(false);
  const [deadline, setDeadline] = useState<string>(
    addDays(new Date(), 3).toISOString().split('T')[0]
  );
  
  const handleAddOption = () => {
    setOptions([
      ...options,
      { id: `option-${Date.now()}`, text: '', image: '' },
    ]);
  };
  
  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return; // Maintain at least 2 options
    setOptions(options.filter(option => option.id !== id));
  };
  
  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map(option => (option.id === id ? { ...option, text } : option))
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate form
    if (!title || !selectedGroupId || options.some(opt => !opt.text)) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Create poll with empty votes arrays
    createPoll({
      title,
      description,
      options: options.map(option => ({ ...option, votes: [] })),
      createdBy: user.id,
      groupId: selectedGroupId,
      deadline: new Date(deadline).toISOString(),
      isPrivate,
    });
    
    // Navigate back to group or polls page
    if (groupId) {
      navigate(`/groups/${groupId}`);
    } else {
      navigate('/');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-6">
      <Input
        label="Poll Title"
        placeholder="What would you like to ask?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <Input
        label="Description (optional)"
        placeholder="Add more details about your poll"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        as="textarea"
        rows={3}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Poll Options
        </label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                required
                className="flex-1"
              />
              <button
                type="button"
                className="ml-2 p-2 text-gray-400 hover:text-red-500"
                onClick={() => handleRemoveOption(option.id)}
                disabled={options.length <= 2}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddOption}
          className="mt-2"
          icon={<Plus size={16} />}
        >
          Add Option
        </Button>
      </div>
      
      {!groupId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group
          </label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            required
          >
            <option value="">Select a group</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          icon={<Calendar size={18} />}
          required
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="private"
          type="checkbox"
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
        />
        <label htmlFor="private" className="ml-2 block text-sm text-gray-700">
          Make this poll private (only visible to group members)
        </label>
      </div>
      
      <div className="pt-4">
        <Button type="submit" variant="primary" fullWidth>
          Create Poll
        </Button>
      </div>
    </form>
  );
};

export default PollCreationForm;