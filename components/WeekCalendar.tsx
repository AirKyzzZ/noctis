import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDreams } from '../providers/DreamContext';
import { useTheme } from '../providers/ThemeContext';

interface DayPillProps {
  date: Date;
  isToday: boolean;
  hasDream: boolean;
}

const DayPill: React.FC<DayPillProps> = ({ date, isToday, hasDream }) => {
  const { colors } = useTheme();
  const dayNumber = date.getDate();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <View className="relative">
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
    </View>
  );
};

export default function WeekCalendar() {
  const { dreams } = useDreams();

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

  return (
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
            />
          );
        })}
      </View>
    </View>
  );
}

