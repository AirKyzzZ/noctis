import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeContext';
import { useNotifications } from '../../providers/NotificationContext';
import { NotificationList, NotificationSettings } from '../../components/notifications';
import { Notification } from '../../types/notification';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const {
    notifications,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    requestPermissions,
    sendTestNotification,
  } = useNotifications();

  const [showSettings, setShowSettings] = useState(false);

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearAllNotifications,
        },
      ]
    );
  };

  const handleUpdateSettings = async (newSettings: any) => {
    await updateSettings(newSettings);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-5 pt-3 pb-4 border-b" style={{ borderColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              🔔 Notifications
            </Text>
            {notifications.length > 0 && (
              <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                {notifications.length} total
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowSettings(!showSettings)}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <Feather
              name={showSettings ? 'x' : 'settings'}
              size={20}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Panel */}
      {showSettings ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <NotificationSettings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRequestPermissions={requestPermissions}
            onSendTest={sendTestNotification}
          />
        </ScrollView>
      ) : (
        /* Notifications List */
        <NotificationList
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={handleClearAll}
        />
      )}
    </SafeAreaView>
  );
}

