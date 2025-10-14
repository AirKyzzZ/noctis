import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';
import { Notification } from '../../types/notification';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationPress,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const { colors } = useTheme();

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: colors.cardBackground }}
      >
        <Feather name="bell-off" size={40} color={colors.textTertiary} />
      </View>
      <Text className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
        No Notifications
      </Text>
      <Text className="text-sm text-center px-8" style={{ color: colors.textSecondary }}>
        You're all caught up! We'll notify you when there's something new.
      </Text>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View className="flex-1">
      {notifications.length > 0 && (
        <View className="flex-row justify-between items-center mb-4 px-5">
          <Text className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </Text>
          <View className="flex-row">
            {unreadCount > 0 && onMarkAllAsRead && (
              <TouchableOpacity
                onPress={onMarkAllAsRead}
                className="flex-row items-center mr-4"
              >
                <Feather name="check-circle" size={16} color={colors.accent} />
                <Text className="text-sm ml-1" style={{ color: colors.accent }}>
                  Read All
                </Text>
              </TouchableOpacity>
            )}
            {notifications.length > 0 && onClearAll && (
              <TouchableOpacity
                onPress={onClearAll}
                className="flex-row items-center"
              >
                <Feather name="trash-2" size={16} color={colors.textTertiary} />
                <Text className="text-sm ml-1" style={{ color: colors.textTertiary }}>
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={onNotificationPress}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

