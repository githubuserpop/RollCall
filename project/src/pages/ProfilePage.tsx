import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Settings, LogOut } from 'lucide-react';
import Avatar from '../components/ui/Avatar';

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    await updateProfile({
      username,
      bio,
    });
    
    setIsEditing(false);
  };
  
  if (!user) {
    return (
      <MainLayout title="Profile">
        <div className="p-4 text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Profile">
      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar
            src={user.avatar}
            alt={user.username}
            size="lg"
            className="mb-3"
          />
          
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="w-full max-w-sm">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-3"
              />
              
              <Input
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                as="textarea"
                rows={3}
                className="mb-4"
              />
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <h1 className="text-xl font-semibold">{user.username}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
              
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                icon={<Settings size={16} />}
                className="mt-4"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <Button
            variant="secondary"
            onClick={logout}
            icon={<LogOut size={16} />}
            fullWidth
          >
            Log Out
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;