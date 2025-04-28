import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from '../components/notifications/NotificationItem';
import Button from '../components/ui/Button';
import { Trash2 } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { notifications, markAllAsRead } = useNotifications();
  
  const hasUnread = notifications.some(notification => !notification.read);
  
  return (
    <MainLayout title="Notifications" showBackButton>
      <div className="px-4 py-4">
        {hasUnread && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="text"
              size="sm"
              onClick={markAllAsRead}
              icon={<Trash2 size={16} />}
            >
              Mark all as read
            </Button>
          </div>
        )}
        
        {notifications.length > 0 ? (
          <div className="border rounded-md divide-y">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;