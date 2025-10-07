export type NotificationType = 'dream_reminder' | 'streak' | 'forecast' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO string
  read: boolean;
  actionUrl?: string; // Optional URL to navigate to when clicked
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReminderTime: string; // Format: "HH:mm" (24-hour format)
  streakReminders: boolean;
  forecastReminders: boolean;
}

