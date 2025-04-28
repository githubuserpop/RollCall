import React from 'react';
import { Friend } from '../../types';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { CheckCircle, XCircle, UserMinus } from 'lucide-react';

interface FriendCardProps {
  friend: Friend;
  onAccept?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onAccept,
  onReject,
  onRemove,
}) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar
            src={friend.avatar}
            alt={friend.username}
            size="md"
            showStatus
            isOnline={friend.isOnline}
            className="mr-3"
          />
          <div>
            <h3 className="text-base font-medium text-gray-900">{friend.username}</h3>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>
        </div>
        
        <div className="flex">
          {friend.status === 'pending' ? (
            <>
              {onAccept && (
                <Button
                  variant="text"
                  onClick={onAccept}
                  icon={<CheckCircle size={18} className="text-green-500" />}
                  className="mr-1"
                />
              )}
              {onReject && (
                <Button
                  variant="text"
                  onClick={onReject}
                  icon={<XCircle size={18} className="text-red-500" />}
                />
              )}
            </>
          ) : (
            onRemove && (
              <Button
                variant="text"
                onClick={onRemove}
                icon={<UserMinus size={18} />}
              />
            )
          )}
        </div>
      </div>
    </Card>
  );
};

export default FriendCard;