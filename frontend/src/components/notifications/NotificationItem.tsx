import React from 'react';
import { Notification } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Bell, MessageCircle, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();
  
  // Choose icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'poll':
        return <Bell size={18} className="text-purple-500" />;
      case 'chat':
        return <MessageCircle size={18} className="text-blue-500" />;
      case 'friend':
        return <UserPlus size={18} className="text-green-500" />;
      case 'group':
        return <Users size={18} className="text-orange-500" />;
      default:
        return <Bell size={18} />;
    }
  };
  
  // Navigate based on notification type
  const handleClick = () => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'poll':
        navigate(`/polls/${notification.relatedId}`);
        break;
      case 'chat':
        // Extract group ID from message ID
        navigate(`/groups/${notification.relatedId.split('-')[0]}/chat`);
        break;
      case 'friend':
        navigate('/friends');
        break;
      case 'group':
        navigate(`/groups/${notification.relatedId}`);
        break;
    }
  };
  
  return (
    <div
      className={`p-3 hover:bg-gray-50 cursor-pointer ${
        !notification.read ? 'bg-purple-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(notification.timestamp)}
          </p>
        </div>
        {!notification.read && (
          <div className="ml-2 w-2 h-2 bg-purple-600 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;