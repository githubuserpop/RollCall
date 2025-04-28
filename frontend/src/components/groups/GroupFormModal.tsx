import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useGroups } from '../../context/GroupContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface GroupFormModalProps {
  onClose: () => void;
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({ onClose }) => {
  const { createGroup } = useGroups();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate form
    if (!name) {
      alert('Please enter a group name');
      return;
    }
    
    // Create group
    createGroup(name, description, [user]);
    
    // Close modal
    onClose();
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 500 } },
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Group</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Group Name"
            placeholder="Enter group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <Input
            label="Description (optional)"
            placeholder="Describe what this group is about"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            as="textarea"
            rows={3}
          />
          
          <div className="pt-2 flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Create Group
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupFormModal;