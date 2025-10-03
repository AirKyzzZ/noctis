import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDreams } from '../../providers/DreamContext';
import {
  DreamType,
  EmotionalState,
  OverallTone,
  SleepQuality,
  EmotionalIntensity,
  DreamClarity,
} from '../../types/dream';

const dreamTypes: { value: DreamType; label: string; icon: string }[] = [
  { value: 'ordinary', label: 'Ordinary', icon: '🌙' },
  { value: 'lucid', label: 'Lucid', icon: '⭐' },
  { value: 'nightmare', label: 'Nightmare', icon: '😱' },
  { value: 'recurring', label: 'Recurring', icon: '🔄' },
  { value: 'prophetic', label: 'Prophetic', icon: '🔮' },
  { value: 'healing', label: 'Healing', icon: '💙' },
];

const emotionalStates: { value: EmotionalState; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'excited', label: 'Excited' },
  { value: 'sad', label: 'Sad' },
  { value: 'happy', label: 'Happy' },
  { value: 'fearful', label: 'Fearful' },
  { value: 'peaceful', label: 'Peaceful' },
  { value: 'restless', label: 'Restless' },
];

const overallTones: { value: OverallTone; label: string; emoji: string }[] = [
  { value: 'positive', label: 'Positive', emoji: '😊' },
  { value: 'negative', label: 'Negative', emoji: '😔' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'mixed', label: 'Mixed', emoji: '🤔' },
];

export default function AddDreamScreen() {
  const router = useRouter();
  const { addDream } = useDreams();

  const [dreamType, setDreamType] = useState<DreamType>('ordinary');
  const [description, setDescription] = useState('');
  const [emotionalStateBefore, setEmotionalStateBefore] = useState<EmotionalState>('calm');
  const [emotionalStateAfter, setEmotionalStateAfter] = useState<EmotionalState>('calm');
  const [characters, setCharacters] = useState('');
  const [location, setLocation] = useState('');
  const [emotionalIntensity, setEmotionalIntensity] = useState<EmotionalIntensity>(3);
  const [clarity, setClarity] = useState<DreamClarity>(3);
  const [tags, setTags] = useState('');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(3);
  const [personalMeaning, setPersonalMeaning] = useState('');
  const [overallTone, setOverallTone] = useState<OverallTone>('neutral');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please provide a dream description.');
      return;
    }

    setSaving(true);

    try {
      const charactersList = characters
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const tagsList = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await addDream({
        dateTime: new Date().toISOString(),
        type: dreamType,
        description,
        emotionalStateBefore,
        emotionalStateAfter,
        characters: charactersList,
        location: location.trim(),
        emotionalIntensity,
        clarity,
        tags: tagsList,
        sleepQuality,
        personalMeaning: personalMeaning.trim(),
        overallTone,
      });

      router.push('/(tabs)/dreams');
    } catch (error) {
      Alert.alert('Error', 'Failed to save dream. Please try again.');
      console.error('Error saving dream:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F9FAFB' }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b px-4 py-3" style={{ borderBottomColor: '#E5E7EB' }}>
          <Pressable onPress={() => router.push('/(tabs)/dreams')} hitSlop={12}>
            <Feather name="x" size={24} color="#1F2937" />
          </Pressable>
          <Text className="text-lg font-bold" style={{ color: '#1F2937' }}>
            New Dream
          </Text>
          <Pressable onPress={handleSave} disabled={saving} hitSlop={12}>
            <Text
              className="text-base font-semibold"
              style={{ color: saving ? '#9CA3AF' : '#8B5CF6' }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-5">
            {/* Dream Type */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-semibold" style={{ color: '#374151' }}>
                Dream Type
              </Text>
              <View className="flex-row flex-wrap">
                {dreamTypes.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => setDreamType(type.value)}
                    className="mb-2 mr-2 flex-row items-center rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: dreamType === type.value ? '#8B5CF6' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: dreamType === type.value ? '#8B5CF6' : '#E5E7EB',
                    }}
                  >
                    <Text className="mr-2 text-base">{type.icon}</Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: dreamType === type.value ? '#FFFFFF' : '#4B5563' }}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Dream Description */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: '#374151' }}>
                Dream Description *
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your dream in detail..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="rounded-xl bg-white p-4 text-base"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                  minHeight: 120,
                }}
              />
            </View>

            {/* Emotional State Before */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-semibold" style={{ color: '#374151' }}>
                Emotional State Before Sleep
              </Text>
              <View className="flex-row flex-wrap">
                {emotionalStates.map((state) => (
                  <Pressable
                    key={`before-${state.value}`}
                    onPress={() => setEmotionalStateBefore(state.value)}
                    className="mb-2 mr-2 rounded-xl px-4 py-2.5"
                    style={{
                      backgroundColor: emotionalStateBefore === state.value ? '#8B5CF6' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: emotionalStateBefore === state.value ? '#8B5CF6' : '#E5E7EB',
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{ color: emotionalStateBefore === state.value ? '#FFFFFF' : '#4B5563' }}
                    >
                      {state.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Emotional State After */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-semibold" style={{ color: '#374151' }}>
                Emotional State After Waking
              </Text>
              <View className="flex-row flex-wrap">
                {emotionalStates.map((state) => (
                  <Pressable
                    key={`after-${state.value}`}
                    onPress={() => setEmotionalStateAfter(state.value)}
                    className="mb-2 mr-2 rounded-xl px-4 py-2.5"
                    style={{
                      backgroundColor: emotionalStateAfter === state.value ? '#8B5CF6' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: emotionalStateAfter === state.value ? '#8B5CF6' : '#E5E7EB',
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{ color: emotionalStateAfter === state.value ? '#FFFFFF' : '#4B5563' }}
                    >
                      {state.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Characters */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: '#374151' }}>
                Characters Present
              </Text>
              <TextInput
                value={characters}
                onChangeText={setCharacters}
                placeholder="Separate names with commas (e.g., Friend, Family member)"
                placeholderTextColor="#9CA3AF"
                className="rounded-xl bg-white p-4 text-base"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                }}
              />
            </View>

            {/* Location */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: '#374151' }}>
                Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Where did the dream take place?"
                placeholderTextColor="#9CA3AF"
                className="rounded-xl bg-white p-4 text-base"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                }}
              />
            </View>

            {/* Sleep Quality */}
            <RatingField
              label="Sleep Quality"
              value={sleepQuality}
              onChange={(val) => setSleepQuality(val as SleepQuality)}
              icon="moon"
            />

            {/* Emotional Intensity */}
            <RatingField
              label="Emotional Intensity"
              value={emotionalIntensity}
              onChange={(val) => setEmotionalIntensity(val as EmotionalIntensity)}
              icon="zap"
            />

            {/* Clarity */}
            <RatingField
              label="Dream Clarity"
              value={clarity}
              onChange={(val) => setClarity(val as DreamClarity)}
              icon="eye"
            />

            {/* Overall Tone */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-semibold" style={{ color: '#374151' }}>
                Overall Tone
              </Text>
              <View className="flex-row flex-wrap">
                {overallTones.map((tone) => (
                  <Pressable
                    key={tone.value}
                    onPress={() => setOverallTone(tone.value)}
                    className="mb-2 mr-2 flex-row items-center rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: overallTone === tone.value ? '#8B5CF6' : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: overallTone === tone.value ? '#8B5CF6' : '#E5E7EB',
                    }}
                  >
                    <Text className="mr-2 text-base">{tone.emoji}</Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: overallTone === tone.value ? '#FFFFFF' : '#4B5563' }}
                    >
                      {tone.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: '#374151' }}>
                Tags / Keywords
              </Text>
              <TextInput
                value={tags}
                onChangeText={setTags}
                placeholder="Separate tags with commas (e.g., flying, water, family)"
                placeholderTextColor="#9CA3AF"
                className="rounded-xl bg-white p-4 text-base"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                }}
              />
            </View>

            {/* Personal Meaning */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: '#374151' }}>
                Personal Meaning
              </Text>
              <TextInput
                value={personalMeaning}
                onChangeText={setPersonalMeaning}
                placeholder="What does this dream mean to you?"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="rounded-xl bg-white p-4 text-base"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                  minHeight: 100,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface RatingFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: keyof typeof Feather.glyphMap;
}

function RatingField({ label, value, onChange, icon }: RatingFieldProps) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-semibold" style={{ color: '#374151' }}>
        {label}
      </Text>
      <View className="flex-row items-center justify-between">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Pressable
            key={rating}
            onPress={() => onChange(rating)}
            className="items-center justify-center rounded-xl"
            style={{
              width: 60,
              height: 60,
              backgroundColor: value >= rating ? '#8B5CF6' : '#FFFFFF',
              borderWidth: 1,
              borderColor: value >= rating ? '#8B5CF6' : '#E5E7EB',
            }}
          >
            <Feather name={icon} size={24} color={value >= rating ? '#FFFFFF' : '#9CA3AF'} />
            <Text
              className="mt-1 text-xs font-semibold"
              style={{ color: value >= rating ? '#FFFFFF' : '#6B7280' }}
            >
              {rating}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

