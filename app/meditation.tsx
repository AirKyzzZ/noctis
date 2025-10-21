import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../services/ThemeService';

type ExerciseType = 'breathing' | 'body-scan' | 'visualization';

interface Exercise {
  id: ExerciseType;
  title: string;
  description: string;
  duration: number; // in minutes
  icon: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'breathing',
    title: '4-7-8 Breathing',
    description: 'Calm your mind with rhythmic breathing before sleep',
    duration: 5,
    icon: '🌬️',
  },
  {
    id: 'body-scan',
    title: 'Body Scan Meditation',
    description: 'Progressive relaxation from head to toe',
    duration: 10,
    icon: '🧘',
  },
  {
    id: 'visualization',
    title: 'Dream Visualization',
    description: 'Prepare your mind for vivid dreams',
    duration: 7,
    icon: '✨',
  },
];

export default function MeditationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  const exercise = EXERCISES.find(e => e.id === selectedExercise);

  useEffect(() => {
    if (!isActive || selectedExercise !== 'breathing') return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) return prev - 1;

        // Move to next phase
        if (phase === 'inhale') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 8;
        } else {
          setPhase('inhale');
          setCycleCount(c => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, selectedExercise]);

  // Breathing circle animation
  useEffect(() => {
    if (!isActive || selectedExercise !== 'breathing') return;

    let duration = 4000;
    let toValue = 1;

    if (phase === 'inhale') {
      duration = 4000;
      toValue = 1;
    } else if (phase === 'hold') {
      duration = 7000;
      toValue = 1;
    } else {
      duration = 8000;
      toValue = 0.8;
    }

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: toValue === 1 ? 0.8 : 0.3,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [phase, isActive, selectedExercise]);

  const startExercise = () => {
    setIsActive(true);
    setCycleCount(0);
    setPhase('inhale');
    setCountdown(4);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(4);
    setCycleCount(0);
  };

  const renderExerciseSelection = () => (
    <View>
      <Text className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
        Choose an Exercise
      </Text>
      {EXERCISES.map(ex => (
        <Pressable
          key={ex.id}
          onPress={() => setSelectedExercise(ex.id)}
          className="rounded-xl p-4 mb-3 active:opacity-70"
          style={{ backgroundColor: colors.gray100 }}
        >
          <View className="flex-row items-start">
            <Text className="text-4xl mr-3">{ex.icon}</Text>
            <View className="flex-1">
              <Text className="text-base font-bold mb-1" style={{ color: colors.textPrimary }}>
                {ex.title}
              </Text>
              <Text className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                {ex.description}
              </Text>
              <View className="flex-row items-center">
                <Feather name="clock" size={14} color={colors.textTertiary} />
                <Text className="text-sm ml-1" style={{ color: colors.textTertiary }}>
                  {ex.duration} minutes
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textTertiary} />
          </View>
        </Pressable>
      ))}
    </View>
  );

  const renderBreathingExercise = () => (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={() => setSelectedExercise(null)}
        className="absolute top-0 left-0 p-4 active:opacity-70"
      >
        <Feather name="arrow-left" size={24} color={colors.textPrimary} />
      </Pressable>

      <Text className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
        {exercise?.title}
      </Text>
      <Text className="text-base mb-8" style={{ color: colors.textSecondary }}>
        Cycle: {cycleCount + 1}
      </Text>

      {/* Breathing Circle */}
      <View className="items-center justify-center mb-12">
        <Animated.View
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.accent,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }}
        />
        <View className="absolute items-center">
          <Text className="text-6xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {countdown}
          </Text>
          <Text className="text-xl capitalize" style={{ color: colors.textPrimary }}>
            {phase === 'hold' ? 'Hold' : phase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View className="px-8 mb-8">
        <Text className="text-center text-base leading-6" style={{ color: colors.textSecondary }}>
          {phase === 'inhale' && 'Breathe in slowly through your nose for 4 seconds'}
          {phase === 'hold' && 'Hold your breath for 7 seconds'}
          {phase === 'exhale' && 'Exhale slowly through your mouth for 8 seconds'}
        </Text>
      </View>

      {/* Controls */}
      <Pressable
        onPress={isActive ? stopExercise : startExercise}
        className="px-8 py-4 rounded-full active:opacity-80"
        style={{ backgroundColor: isActive ? colors.gray600 : colors.accent }}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isActive ? 'Stop' : 'Start'}
        </Text>
      </Pressable>
    </View>
  );

  const renderBodyScanExercise = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <Pressable
        onPress={() => setSelectedExercise(null)}
        className="p-4 active:opacity-70 self-start"
      >
        <Feather name="arrow-left" size={24} color={colors.textPrimary} />
      </Pressable>

      <View className="px-6 pb-6">
        <Text className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {exercise?.title}
        </Text>
        <Text className="text-base mb-6" style={{ color: colors.textSecondary }}>
          Progressive relaxation technique
        </Text>

        <View className="rounded-xl p-6 mb-4" style={{ backgroundColor: colors.gray100 }}>
          <Text className="text-base leading-7" style={{ color: colors.textPrimary }}>
            1. Lie down in a comfortable position{'\n\n'}
            2. Close your eyes and take three deep breaths{'\n\n'}
            3. Focus on your forehead and relax any tension{'\n\n'}
            4. Move down to your eyes, jaw, and neck{'\n\n'}
            5. Relax your shoulders, arms, and hands{'\n\n'}
            6. Soften your chest and abdomen{'\n\n'}
            7. Release tension from your hips and legs{'\n\n'}
            8. Finally, relax your feet and toes{'\n\n'}
            9. Stay in this relaxed state for a few minutes{'\n\n'}
            10. When ready, slowly open your eyes
          </Text>
        </View>

        <View className="rounded-xl p-4" style={{ backgroundColor: colors.accent + '20' }}>
          <View className="flex-row items-start">
            <Feather name="info" size={20} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
            <Text className="flex-1 text-sm leading-5" style={{ color: colors.textPrimary }}>
              This exercise helps release physical tension and prepares your body for restful sleep.
              Practice regularly for best results.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderVisualizationExercise = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <Pressable
        onPress={() => setSelectedExercise(null)}
        className="p-4 active:opacity-70 self-start"
      >
        <Feather name="arrow-left" size={24} color={colors.textPrimary} />
      </Pressable>

      <View className="px-6 pb-6">
        <Text className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {exercise?.title}
        </Text>
        <Text className="text-base mb-6" style={{ color: colors.textSecondary }}>
          Set intentions for your dreams tonight
        </Text>

        <View className="rounded-xl p-6 mb-4" style={{ backgroundColor: colors.gray100 }}>
          <Text className="text-base leading-7" style={{ color: colors.textPrimary }}>
            1. Close your eyes and breathe deeply{'\n\n'}
            2. Imagine yourself in a peaceful place{'\n\n'}
            3. Visualize what you want to dream about{'\n\n'}
            4. See yourself becoming aware in the dream{'\n\n'}
            5. Picture yourself exploring with curiosity{'\n\n'}
            6. Set an intention: "I will remember my dreams"{'\n\n'}
            7. Repeat: "Tonight I will dream vividly"{'\n\n'}
            8. Feel gratitude for your dream experiences{'\n\n'}
            9. Slowly let the visualization fade{'\n\n'}
            10. Keep a calm, open mindset as you sleep
          </Text>
        </View>

        <View className="rounded-xl p-4" style={{ backgroundColor: colors.accent + '20' }}>
          <View className="flex-row items-start">
            <Feather name="moon" size={20} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
            <Text className="flex-1 text-sm leading-5" style={{ color: colors.textPrimary }}>
              Visualization before sleep can improve dream recall and increase the likelihood of lucid
              dreams. Practice this nightly for optimal results.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {!selectedExercise ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <Pressable onPress={() => router.back()} className="mr-4 active:opacity-70">
                <Feather name="arrow-left" size={24} color={colors.textPrimary} />
              </Pressable>
              <View className="flex-1">
                <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                  Meditation
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Relax before sleep
                </Text>
              </View>
            </View>

            {/* Info Card */}
            <View className="rounded-xl p-4 mb-6" style={{ backgroundColor: colors.accent + '20' }}>
              <View className="flex-row items-start">
                <Feather name="moon" size={24} color={colors.accent} style={{ marginRight: 12 }} />
                <View className="flex-1">
                  <Text className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                    Better Sleep, Better Dreams
                  </Text>
                  <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
                    Meditation before bed can improve sleep quality and dream recall. Choose an exercise
                    to begin your relaxation journey.
                  </Text>
                </View>
              </View>
            </View>

            {renderExerciseSelection()}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1">
          {selectedExercise === 'breathing' && renderBreathingExercise()}
          {selectedExercise === 'body-scan' && renderBodyScanExercise()}
          {selectedExercise === 'visualization' && renderVisualizationExercise()}
        </View>
      )}
    </SafeAreaView>
  );
}

