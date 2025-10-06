import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeContext';

export default function QuickAddDreamCard() {
  const router = useRouter();
  const { isDark } = useTheme();

  const handleAddDream = () => {
    router.push('/dreams/add');
  };

  return (
    <View className="mx-4 mt-2 mb-4">
      <Pressable
        onPress={handleAddDream}
        className="overflow-hidden rounded-3xl"
        style={{
          shadowColor: '#8B5CF6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={isDark ? ['#2D1B4E', '#1F1438', '#2D1B4E'] : ['#F3E8FF', '#EDE9FE', '#E9D5FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 24,
            paddingHorizontal: 24,
            minHeight: 160,
          }}
        >
          {/* Left side - Text and CTA Button */}
          <View style={{ flex: 1, paddingRight: 16, justifyContent: 'center' }}>
            <Text
              className="mb-4 text-xl font-bold leading-tight"
              style={{ color: isDark ? '#E9D5FF' : '#4C1D95' }}
            >
              Your dream journal awaits
            </Text>
            
            <Pressable
              onPress={handleAddDream}
              className="self-start rounded-full px-6 py-3"
              style={{
                backgroundColor: '#8B5CF6',
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center">
                <Feather name="plus" size={18} color="#FFFFFF" />
                <Text className="ml-2 text-base font-bold text-white">
                  Add Dream
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Right side - 3D Moon Icon */}
          <View
            style={{
              width: 120,
              height: 120,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Image
              source={require('../../assets/moon-icon-homecard.png')}
              style={{
                width: 120,
                height: 120,
              }}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

