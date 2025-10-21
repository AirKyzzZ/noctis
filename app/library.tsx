import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../services/ThemeService';

type ContentSection = 'guides' | 'techniques' | 'tips';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string[];
}

const GUIDES: ContentItem[] = [
  {
    id: 'what-are-dreams',
    title: 'What Are Dreams?',
    description: 'Understanding the science and purpose of dreams',
    icon: '💭',
    content: [
      'Dreams are experiences during sleep that combine imagery, thoughts, and emotions.',
      'They occur primarily during REM (Rapid Eye Movement) sleep.',
      'Dreams can help process emotions, consolidate memories, and solve problems.',
      'Everyone dreams, even if they don\'t remember their dreams.',
      'Dream content often reflects daily experiences, concerns, and emotions.',
    ],
  },
  {
    id: 'lucid-dreaming-intro',
    title: 'Introduction to Lucid Dreaming',
    description: 'What is lucid dreaming and how does it work?',
    icon: '✨',
    content: [
      'Lucid dreaming is being aware that you\'re dreaming while still asleep.',
      'In lucid dreams, you can often control the dream narrative and environment.',
      'Studies show that lucid dreaming is a learnable skill.',
      'Benefits include overcoming nightmares, creative problem-solving, and self-exploration.',
      'Most people can learn to lucid dream with regular practice.',
    ],
  },
  {
    id: 'dream-recall',
    title: 'Improving Dream Recall',
    description: 'Techniques to remember your dreams better',
    icon: '🧠',
    content: [
      'Keep a dream journal next to your bed and write immediately upon waking.',
      'Set the intention to remember your dreams before falling asleep.',
      'Wake up naturally without an alarm when possible.',
      'Stay still when you first wake up to preserve dream memories.',
      'Look for dream patterns and recurring themes in your journal.',
    ],
  },
  {
    id: 'sleep-cycles',
    title: 'Understanding Sleep Cycles',
    description: 'How sleep stages affect your dreams',
    icon: '🌙',
    content: [
      'A complete sleep cycle lasts about 90 minutes.',
      'We go through 4-6 cycles per night.',
      'REM sleep occurs more in later cycles (early morning).',
      'Dreams are more vivid and memorable during REM sleep.',
      'Waking during or just after REM improves dream recall.',
    ],
  },
];

const TECHNIQUES: ContentItem[] = [
  {
    id: 'mild',
    title: 'MILD (Mnemonic Induction)',
    description: 'Setting intentions before sleep',
    icon: '🎯',
    content: [
      'As you fall asleep, repeat: "I will remember I\'m dreaming"',
      'Visualize yourself becoming lucid in a recent dream.',
      'Focus on your intention without strain or effort.',
      'This technique works best combined with WBTB.',
      'Practice consistency is key - do this every night.',
    ],
  },
  {
    id: 'wbtb',
    title: 'WBTB (Wake Back To Bed)',
    description: 'Waking during REM for better lucidity',
    icon: '⏰',
    content: [
      'Set an alarm for 5-6 hours after falling asleep.',
      'Stay awake for 15-60 minutes (reading about lucid dreaming works well).',
      'Go back to sleep with the intention to lucid dream.',
      'Your next sleep period will be REM-rich, increasing lucid dream chances.',
      'Combine with MILD for best results.',
    ],
  },
  {
    id: 'reality-checks',
    title: 'Reality Checks',
    description: 'Training your mind to question reality',
    icon: '❓',
    content: [
      'Regularly ask yourself: "Am I dreaming?" throughout the day.',
      'Look at your hands - in dreams they often appear distorted.',
      'Try to push your finger through your palm.',
      'Read text twice - it often changes in dreams.',
      'Check digital clocks - numbers are unstable in dreams.',
      'Do 5-10 reality checks per day until it becomes a habit.',
    ],
  },
  {
    id: 'wild',
    title: 'WILD (Wake Initiated Lucid Dreams)',
    description: 'Entering dreams while maintaining awareness',
    icon: '🌊',
    content: [
      'Lie still and relax your body completely.',
      'Keep your mind aware as your body falls asleep.',
      'Observe hypnagogic imagery without engaging.',
      'When imagery becomes stable, you can "enter" the dream.',
      'Advanced technique - requires patience and practice.',
    ],
  },
  {
    id: 'fild',
    title: 'FILD (Finger Induced Lucid Dream)',
    description: 'Gentle finger movements to induce lucidity',
    icon: '👆',
    content: [
      'Use after waking during the night (WBTB).',
      'Lie still and gently move your index and middle fingers.',
      'Movement should be minimal - like playing piano keys.',
      'After 30-60 seconds, do a reality check.',
      'If successful, you\'ll be in a lucid dream.',
    ],
  },
  {
    id: 'dream-signs',
    title: 'Identifying Dream Signs',
    description: 'Recognizing patterns in your dreams',
    icon: '🔍',
    content: [
      'Review your dream journal for recurring elements.',
      'Common dream signs: unusual people, impossible events, odd locations.',
      'When you notice your dream signs, do a reality check.',
      'Create a personal list of your most common dream signs.',
      'Train yourself to recognize these signs as triggers for lucidity.',
    ],
  },
];

const TIPS: ContentItem[] = [
  {
    id: 'consistency',
    title: 'Consistency is Key',
    description: 'Building a sustainable practice',
    icon: '📅',
    content: [
      'Journal every morning, even if you don\'t remember dreams.',
      'Practice reality checks at the same times daily.',
      'Maintain a regular sleep schedule.',
      'Be patient - lucid dreaming is a skill that develops over time.',
      'Celebrate small wins and progress.',
    ],
  },
  {
    id: 'dream-stability',
    title: 'Stabilizing Lucid Dreams',
    description: 'Staying lucid and preventing wake-ups',
    icon: '⚖️',
    content: [
      'When lucid, stay calm - excitement can wake you up.',
      'Rub your hands together or spin in place to stabilize.',
      'Look at your hands or the ground periodically.',
      'Engage your senses - touch objects, feel textures.',
      'Shout "Increase clarity!" or "Stabilize!" in the dream.',
    ],
  },
  {
    id: 'supplements',
    title: 'Natural Dream Enhancement',
    description: 'Foods and habits that support dreaming',
    icon: '🌿',
    content: [
      'Vitamin B6 may increase dream vividness and recall.',
      'Avoid alcohol and heavy meals before bed.',
      'Stay hydrated throughout the day.',
      'Some people find melatonin helpful for sleep quality.',
      'Always consult a healthcare provider before taking supplements.',
    ],
  },
  {
    id: 'meditation',
    title: 'Meditation for Lucid Dreaming',
    description: 'Using mindfulness to enhance awareness',
    icon: '🧘',
    content: [
      'Regular meditation improves self-awareness in dreams.',
      'Practice mindfulness throughout the day.',
      'Use our meditation exercises before sleep.',
      'Focus on awareness rather than controlling thoughts.',
      'Even 10 minutes daily can improve results.',
    ],
  },
  {
    id: 'common-mistakes',
    title: 'Common Mistakes to Avoid',
    description: 'Pitfalls that hinder lucid dreaming progress',
    icon: '⚠️',
    content: [
      'Don\'t give up too quickly - it takes time.',
      'Avoid irregular sleep schedules.',
      'Don\'t neglect your dream journal.',
      'Don\'t expect perfection - enjoy the journey.',
      'Avoid screen time before bed (blue light disrupts REM).',
    ],
  },
];

export default function LibraryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ContentSection>('guides');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const currentContent = {
    guides: GUIDES,
    techniques: TECHNIQUES,
    tips: TIPS,
  }[activeSection];

  const sections: { id: ContentSection; label: string; icon: string }[] = [
    { id: 'guides', label: 'Guides', icon: 'book' },
    { id: 'techniques', label: 'Techniques', icon: 'target' },
    { id: 'tips', label: 'Tips', icon: 'compass' },
  ];

  const toggleItem = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Pressable onPress={() => router.back()} className="mr-4 active:opacity-70">
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </Pressable>
            <View className="flex-1">
              <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                Dream Library
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Your guide to better dreaming
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View className="rounded-xl p-4 mb-6" style={{ backgroundColor: colors.accent + '20' }}>
            <View className="flex-row items-start">
              <Feather name="info" size={20} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
              <Text className="flex-1 text-sm leading-5" style={{ color: colors.textPrimary }}>
                Welcome to the dream library! Explore guides, learn proven techniques, and discover tips
                to enhance your dream journaling and lucid dreaming practice.
              </Text>
            </View>
          </View>

          {/* Section Tabs */}
          <View className="flex-row gap-2 mb-6">
            {sections.map(section => (
              <Pressable
                key={section.id}
                onPress={() => {
                  setActiveSection(section.id);
                  setExpandedItem(null);
                }}
                className="flex-1 py-3 px-3 rounded-xl active:opacity-70"
                style={{
                  backgroundColor: activeSection === section.id ? colors.accent : colors.gray100,
                }}
              >
                <View className="items-center">
                  <Feather
                    name={section.icon as any}
                    size={18}
                    color={activeSection === section.id ? '#FFFFFF' : colors.textPrimary}
                    style={{ marginBottom: 4 }}
                  />
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: activeSection === section.id ? '#FFFFFF' : colors.textPrimary,
                    }}
                  >
                    {section.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Content Items */}
          {currentContent.map((item) => (
            <View
              key={item.id}
              className="rounded-xl mb-3 overflow-hidden"
              style={{ backgroundColor: colors.gray100 }}
            >
              <Pressable
                onPress={() => toggleItem(item.id)}
                className="p-4 active:opacity-70"
              >
                <View className="flex-row items-start">
                  <Text className="text-3xl mr-3">{item.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-bold mb-1" style={{ color: colors.textPrimary }}>
                      {item.title}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>
                      {item.description}
                    </Text>
                  </View>
                  <Feather
                    name={expandedItem === item.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textTertiary}
                  />
                </View>
              </Pressable>

              {expandedItem === item.id && (
                <View className="px-4 pb-4">
                  <View
                    className="h-px mb-3"
                    style={{ backgroundColor: colors.gray200 }}
                  />
                  {item.content.map((point, index) => (
                    <View key={index} className="flex-row mb-2">
                      <Text className="mr-2" style={{ color: colors.accent }}>
                        •
                      </Text>
                      <Text className="flex-1 text-sm leading-6" style={{ color: colors.textPrimary }}>
                        {point}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

