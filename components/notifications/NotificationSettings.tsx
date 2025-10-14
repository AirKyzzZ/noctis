import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';
import { NotificationSettings as NotificationSettingsType } from '../../types/notification';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdateSettings: (settings: Partial<NotificationSettingsType>) => void;
  onRequestPermissions: () => Promise<boolean>;
  onSendTest?: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdateSettings,
  onRequestPermissions,
  onSendTest,
}) => {
  const { colors } = useTheme();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      const hasPermission = await onRequestPermissions();
      if (hasPermission) {
        onUpdateSettings({ enabled: true });
      }
    } else {
      onUpdateSettings({ enabled: false });
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      onUpdateSettings({ dailyReminderTime: `${hours}:${minutes}` });
    }
  };

  const getTimeFromString = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <View className="px-5 py-4">
      <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        Notification Settings
      </Text>

      {/* Enable Notifications */}
      <View
        className="rounded-2xl p-4 mb-3"
        style={{ backgroundColor: colors.cardBackground }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
              Daily Reminders
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Get notified to record your dreams
            </Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.border, true: colors.accent + '80' }}
            thumbColor={settings.enabled ? colors.accent : colors.textTertiary}
          />
        </View>
      </View>

      {/* Time Picker */}
      {settings.enabled && (
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.7}
        >
          <View
            className="rounded-2xl p-4 mb-3"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Reminder Time
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  When to send daily reminders
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-base font-bold mr-2" style={{ color: colors.accent }}>
                  {formatTime(settings.dailyReminderTime)}
                </Text>
                <Feather name="clock" size={20} color={colors.textTertiary} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Additional Settings */}
      {settings.enabled && (
        <>
          <View
            className="rounded-2xl p-4 mb-3"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Streak Reminders
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Notify about streak milestones
                </Text>
              </View>
              <Switch
                value={settings.streakReminders}
                onValueChange={(value) => onUpdateSettings({ streakReminders: value })}
                trackColor={{ false: colors.border, true: colors.accent + '80' }}
                thumbColor={settings.streakReminders ? colors.accent : colors.textTertiary}
              />
            </View>
          </View>

          <View
            className="rounded-2xl p-4 mb-3"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  Forecast Reminders
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Notify about favorable dream conditions
                </Text>
              </View>
              <Switch
                value={settings.forecastReminders}
                onValueChange={(value) => onUpdateSettings({ forecastReminders: value })}
                trackColor={{ false: colors.border, true: colors.accent + '80' }}
                thumbColor={settings.forecastReminders ? colors.accent : colors.textTertiary}
              />
            </View>
          </View>

          {/* Test Notification Button */}
          {onSendTest && (
            <TouchableOpacity
              onPress={onSendTest}
              activeOpacity={0.7}
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.accent }}
            >
              <View className="flex-row items-center justify-center">
                <Feather name="bell" size={20} color="#FFFFFF" />
                <Text className="text-base font-semibold ml-2" style={{ color: '#FFFFFF' }}>
                  Send Test Notification
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide"
          >
            <View className="flex-1 justify-end">
              <TouchableOpacity
                className="flex-1"
                activeOpacity={1}
                onPress={() => setShowTimePicker(false)}
              />
              <View
                className="rounded-t-3xl p-5"
                style={{ backgroundColor: colors.background }}
              >
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    Select Time
                  </Text>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text className="text-base font-semibold" style={{ color: colors.accent }}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={getTimeFromString(settings.dailyReminderTime)}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor={colors.textPrimary}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={getTimeFromString(settings.dailyReminderTime)}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </View>
  );
};

