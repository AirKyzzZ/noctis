import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';
import { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onMarkAsRead,
  onDelete,
}) => {
  const { colors } = useTheme();
  const [showActions, setShowActions] = React.useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'dream_reminder':
        return 'moon';
      case 'streak':
        return 'award';
      case 'forecast':
        return 'sun';
      default:
        return 'bell';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) {
          onPress(notification);
        }
        if (!notification.read && onMarkAsRead) {
          onMarkAsRead(notification.id);
        }
      }}
      onLongPress={() => setShowActions(!showActions)}
      activeOpacity={0.7}
      className="mb-3"
    >
      <View
        className="rounded-2xl p-4 border"
        style={{
          backgroundColor: notification.read ? colors.cardBackground : colors.gray100,
          borderColor: notification.read ? colors.border : colors.accent,
        }}
      >
        <View className="flex-row items-start">
          {/* Icon */}
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.accent + '20' }}
          >
            <Feather
              name={getNotificationIcon(notification.type) as any}
              size={20}
              color={colors.accent}
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-1">
              <Text
                className="text-base font-bold flex-1"
                style={{ color: colors.textPrimary }}
              >
                {notification.title}
              </Text>
              {!notification.read && (
                <View
                  className="w-2 h-2 rounded-full ml-2 mt-1"
                  style={{ backgroundColor: colors.accent }}
                />
              )}
            </View>

            <Text
              className="text-sm mb-2"
              style={{ color: colors.textSecondary }}
            >
              {notification.message}
            </Text>

            <Text
              className="text-xs"
              style={{ color: colors.textTertiary }}
            >
              {getTimeAgo(notification.createdAt)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        {showActions && (
          <View className="flex-row mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
            {!notification.read && onMarkAsRead && (
              <TouchableOpacity
                onPress={() => {
                  onMarkAsRead(notification.id);
                  setShowActions(false);
                }}
                className="flex-row items-center mr-4"
              >
                <Feather name="check" size={16} color={colors.accent} />
                <Text className="text-sm ml-1" style={{ color: colors.accent }}>
                  Mark as Read
                </Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                onPress={() => {
                  onDelete(notification.id);
                  setShowActions(false);
                }}
                className="flex-row items-center"
              >
                <Feather name="trash-2" size={16} color="#EF4444" />
                <Text className="text-sm ml-1" style={{ color: '#EF4444' }}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

