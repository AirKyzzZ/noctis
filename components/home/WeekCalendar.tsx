import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { useDreams } from '../../services/DreamService';
import { useTheme } from '../../services/ThemeService';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Dream } from '../../types/dream';

interface DayPillProps {
  date: Date;
  isToday: boolean;
  hasDream: boolean;
  onPress: () => void;
}

const DayPill: React.FC<DayPillProps> = ({ date, isToday, hasDream, onPress }) => {
  const { colors } = useTheme();
  const dayNumber = date.getDate();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <Pressable 
      onPress={onPress}
      className="relative active:opacity-70"
    >
      {/* Dream indicator dot */}
      {hasDream && (
        <View 
          className="absolute top-1 left-1/2 -ml-1 w-2 h-2 rounded-full z-10"
          style={{ backgroundColor: isToday ? colors.background : colors.foreground }}
        />
      )}
      
      {/* Pill container */}
      <View
        className="px-3 pt-4 pb-2 rounded-full items-center justify-center min-w-[56px]"
        style={{ 
          minHeight: 56,
          backgroundColor: isToday ? colors.foreground : colors.cardBackground,
          borderWidth: isToday ? 0 : 1,
          borderColor: colors.border
        }}
      >
        <Text 
          className="text-xs font-medium"
          style={{ color: isToday ? colors.background : colors.textSecondary }}
        >
          {dayName}
        </Text>
        <Text 
          className="text-lg font-bold mt-0.5"
          style={{ color: isToday ? colors.background : colors.textPrimary }}
        >
          {dayNumber}
        </Text>
      </View>
    </Pressable>
  );
};

export default function WeekCalendar() {
  const { dreams } = useDreams();
  const { colors } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate array of the last 6 days (5 past + today)
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    
    return days;
  }, []);

  // Check if a dream exists for a given date
  const hasDreamOnDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return dreams.some((dream) => {
      const dreamDate = new Date(dream.dateTime);
      const dreamDateStr = dreamDate.toISOString().split('T')[0];
      return dreamDateStr === dateStr;
    });
  };

  // Get dreams for a specific date
  const getDreamsForDate = (date: Date): Dream[] => {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return dreams.filter((dream) => {
      const dreamDate = new Date(dream.dateTime);
      const dreamDateStr = dreamDate.toISOString().split('T')[0];
      return dreamDateStr === dateStr;
    });
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleAddDream = () => {
    setModalVisible(false);
    // Navigate to add dream screen
    // Note: We'll pass the date via the URL or use a shared state
    router.push('/dreams/add');
  };

  const handleViewDream = (dreamId: string) => {
    setModalVisible(false);
    router.push(`/dreams/${dreamId}` as any);
  };

  const formatModalDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const selectedDayDreams = selectedDate ? getDreamsForDate(selectedDate) : [];

  return (
    <>
      <View className="px-6 py-2">
        <View className="flex-row items-center justify-evenly">
          {weekDays.map((date, index) => {
            const isToday = index === weekDays.length - 1;
            const hasDream = hasDreamOnDate(date);
            
            return (
              <DayPill
                key={date.toISOString()}
                date={date}
                isToday={isToday}
                hasDream={hasDream}
                onPress={() => handleDayPress(date)}
              />
            );
          })}
        </View>
      </View>

      {/* Dreams Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          className="flex-1 justify-end" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            className="rounded-t-3xl"
            style={{ backgroundColor: colors.background }}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView 
              style={{ maxHeight: '85%' }}
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              <View className="pt-6 px-6 pb-12">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                      {selectedDate && formatModalDate(selectedDate)}
                    </Text>
                    <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                      {selectedDayDreams.length} {selectedDayDreams.length === 1 ? 'dream' : 'dreams'}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    className="active:opacity-70"
                    hitSlop={12}
                  >
                    <Feather name="x" size={24} color={colors.textPrimary} />
                  </Pressable>
                </View>

                {/* Dreams List */}
                {selectedDayDreams.length > 0 ? (
                  <View className="gap-3 mb-4">
                    {selectedDayDreams.map((dream) => (
                      <Pressable
                        key={dream.id}
                        onPress={() => handleViewDream(dream.id)}
                        className="p-4 rounded-xl active:opacity-70"
                        style={{
                          backgroundColor: colors.cardBackground,
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
                            {dream.type.charAt(0).toUpperCase() + dream.type.slice(1)} Dream
                          </Text>
                          <Feather name="chevron-right" size={20} color={colors.textTertiary} />
                        </View>
                        <Text 
                          className="text-sm mb-2" 
                          style={{ color: colors.textSecondary }}
                          numberOfLines={2}
                        >
                          {dream.description}
                        </Text>
                        {dream.tags.length > 0 && (
                          <View className="flex-row flex-wrap gap-2">
                            {dream.tags.slice(0, 3).map((tag, idx) => (
                              <View
                                key={idx}
                                className="px-2 py-1 rounded-md"
                                style={{ backgroundColor: colors.gray100 }}
                              >
                                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                                  {tag}
                                </Text>
                              </View>
                            ))}
                            {dream.tags.length > 3 && (
                              <View
                                className="px-2 py-1 rounded-md"
                                style={{ backgroundColor: colors.gray100 }}
                              >
                                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                                  +{dream.tags.length - 3} more
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <View className="items-center py-8">
                    <View 
                      className="w-20 h-20 rounded-full items-center justify-center mb-4"
                      style={{ backgroundColor: colors.gray100 }}
                    >
                      <Feather name="moon" size={36} color={colors.textTertiary} />
                    </View>
                    <Text className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                      No Dreams Recorded
                    </Text>
                    <Text className="text-sm text-center mb-6" style={{ color: colors.textSecondary }}>
                      You haven't registered any dreams for this day yet.
                    </Text>
                  </View>
                )}

                {/* Add Dream Button */}
                <Pressable
                  onPress={handleAddDream}
                  className="flex-row items-center justify-center p-4 rounded-xl active:opacity-70"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                  <Text className="text-base font-bold ml-2" style={{ color: '#FFFFFF' }}>
                    {selectedDayDreams.length > 0 ? 'Add Another Dream' : 'Add Dream for This Day'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

