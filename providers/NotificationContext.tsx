import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Notification, NotificationSettings, NotificationType } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  loading: boolean;
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  scheduleDailyReminder: () => Promise<void>;
  cancelDailyReminder: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  settings: {
    enabled: false,
    dailyReminderTime: '09:00',
    streakReminders: true,
    forecastReminders: true,
  },
  loading: true,
  unreadCount: 0,
  addNotification: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
  clearAllNotifications: async () => {},
  updateSettings: async () => {},
  requestPermissions: async () => false,
  scheduleDailyReminder: async () => {},
  cancelDailyReminder: async () => {},
  sendTestNotification: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

const NOTIFICATIONS_STORAGE_KEY = '@noctis_notifications';
const NOTIFICATION_SETTINGS_KEY = '@noctis_notification_settings';
const DAILY_REMINDER_IDENTIFIER = 'noctis_daily_dream_reminder';

// Configure how notifications should be handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyReminderTime: '09:00',
    streakReminders: true,
    forecastReminders: true,
  });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  // Auto-schedule daily reminder when settings are loaded and enabled
  useEffect(() => {
    if (!loading && settings.enabled) {
      scheduleDailyReminder();
    }
  }, [loading, settings.enabled, settings.dailyReminderTime]);

  useEffect(() => {
    // Update unread count whenever notifications change
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      const notificationsData = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (notificationsData) {
        const parsedNotifications = JSON.parse(notificationsData);
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveNotifications = async (newNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Dream Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const scheduleDailyReminder = async () => {
    try {
      // Cancel existing reminder first
      await cancelDailyReminder();

      if (!settings.enabled) {
        return;
      }

      // Parse the time from settings (format: "HH:mm")
      const [hours, minutes] = settings.dailyReminderTime.split(':').map(Number);

      // Schedule daily notification
      await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_IDENTIFIER,
        content: {
          title: '🌙 Time to Record Your Dreams',
          body: 'Did you have any dreams last night? Log them while they\'re still fresh!',
          data: { type: 'dream_reminder', actionUrl: '/dreams/add' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
    }
  };

  const cancelDailyReminder = async () => {
    try {
      await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_IDENTIFIER);
    } catch (error) {
      console.error('Error cancelling daily reminder:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌙 Test Notification',
          body: 'Your notifications are working! You\'ll receive reminders like this to log your dreams.',
          data: { type: 'dream_reminder', actionUrl: '/dreams/add' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    await saveNotifications(updatedNotifications);
  };

  const markAsRead = async (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    await saveNotifications(updatedNotifications);
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    await saveNotifications(updatedNotifications);
  };

  const deleteNotification = async (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    await saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = async () => {
    await saveNotifications([]);
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await saveSettings(updatedSettings);

    // Reschedule daily reminder if settings changed
    if (newSettings.enabled !== undefined || newSettings.dailyReminderTime !== undefined) {
      if (updatedSettings.enabled) {
        await scheduleDailyReminder();
      } else {
        await cancelDailyReminder();
      }
    }
  };

  // Listen for foreground notifications
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data as {
        type?: NotificationType;
        actionUrl?: string;
      };

      // Add notification to in-app list when received in foreground
      if (data.type) {
        addNotification({
          type: data.type,
          title: notification.request.content.title || 'Notification',
          message: notification.request.content.body || '',
          actionUrl: data.actionUrl,
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        settings,
        loading,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        updateSettings,
        requestPermissions,
        scheduleDailyReminder,
        cancelDailyReminder,
        sendTestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

