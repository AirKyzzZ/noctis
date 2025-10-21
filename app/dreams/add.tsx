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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDreams } from '../../services/DreamService';
import { useTheme } from '../../services/ThemeService';
import { VoiceInput } from '../../components/dreams';
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
  const { colors, isDark } = useTheme();

  const [dreamDate, setDreamDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDreamDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
        dateTime: dreamDate.toISOString(),
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b px-4 py-3" style={{ borderBottomColor: colors.border }}>
          <Pressable onPress={() => router.push('/(tabs)/dreams')} hitSlop={12}>
            <Feather name="x" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            New Dream
          </Text>
          <Pressable onPress={handleSave} disabled={saving} hitSlop={12}>
            <Text
              className="text-base font-semibold"
              style={{ color: saving ? colors.textTertiary : colors.accent }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-5">
            {/* Dream Type */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Dream Type
              </Text>
              <View className="flex-row flex-wrap">
                {dreamTypes.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => setDreamType(type.value)}
                    className="mb-2 mr-2 flex-row items-center rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: dreamType === type.value ? colors.accent : colors.cardBackground,
                      borderWidth: 1,
                      borderColor: dreamType === type.value ? colors.accent : colors.border,
                    }}
                  >
                    <Text className="mr-2 text-base">{type.icon}</Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: dreamType === type.value ? '#FFFFFF' : colors.textSecondary }}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Dream Date */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Dream Date
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center justify-between rounded-xl p-4"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View className="flex-row items-center">
                  <Feather name="calendar" size={20} color={colors.accent} />
                  <Text className="ml-3 text-base" style={{ color: colors.textPrimary }}>
                    {formatDate(dreamDate)}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.textTertiary} />
              </Pressable>
              {(showDatePicker || Platform.OS === 'ios') && (
                <View className="mt-3">
                  <DateTimePicker
                    value={dreamDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    themeVariant={isDark ? 'dark' : 'light'}
                  />
                </View>
              )}
            </View>

            {/* Dream Description */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Dream Description *
              </Text>
              
              {/* Voice Input */}
              <VoiceInput
                onTranscript={(text) => {
                  if (text) {
                    setDescription(prev => prev ? `${prev} ${text}` : text);
                  }
                }}
                placeholder="Record your dream with your voice"
              />

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your dream in detail..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="rounded-xl p-4 text-base"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  minHeight: 120,
                }}
              />
            </View>

            {/* Emotional State Before */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Emotional State Before Sleep
              </Text>
              <View className="flex-row flex-wrap">
                {emotionalStates.map((state) => (
                  <Pressable
                    key={`before-${state.value}`}
                    onPress={() => setEmotionalStateBefore(state.value)}
                    className="mb-2 mr-2 rounded-xl px-4 py-2.5"
                    style={{
                      backgroundColor: emotionalStateBefore === state.value ? colors.accent : colors.cardBackground,
                      borderWidth: 1,
                      borderColor: emotionalStateBefore === state.value ? colors.accent : colors.border,
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{ color: emotionalStateBefore === state.value ? '#FFFFFF' : colors.textSecondary }}
                    >
                      {state.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Emotional State After */}
            <View className="mb-6">
              <Text className="mb-3 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Emotional State After Waking
              </Text>
              <View className="flex-row flex-wrap">
                {emotionalStates.map((state) => (
                  <Pressable
                    key={`after-${state.value}`}
                    onPress={() => setEmotionalStateAfter(state.value)}
                    className="mb-2 mr-2 rounded-xl px-4 py-2.5"
                    style={{
                      backgroundColor: emotionalStateAfter === state.value ? colors.accent : colors.cardBackground,
                      borderWidth: 1,
                      borderColor: emotionalStateAfter === state.value ? colors.accent : colors.border,
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{ color: emotionalStateAfter === state.value ? '#FFFFFF' : colors.textSecondary }}
                    >
                      {state.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Characters */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Characters Present
              </Text>
              <TextInput
                value={characters}
                onChangeText={setCharacters}
                placeholder="Separate names with commas (e.g., Friend, Family member)"
                placeholderTextColor={colors.textTertiary}
                className="rounded-xl p-4 text-base"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
              />
            </View>

            {/* Location */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Where did the dream take place?"
                placeholderTextColor={colors.textTertiary}
                className="rounded-xl p-4 text-base"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.textPrimary,
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
              <Text className="mb-3 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Overall Tone
              </Text>
              <View className="flex-row flex-wrap">
                {overallTones.map((tone) => (
                  <Pressable
                    key={tone.value}
                    onPress={() => setOverallTone(tone.value)}
                    className="mb-2 mr-2 flex-row items-center rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: overallTone === tone.value ? colors.accent : colors.cardBackground,
                      borderWidth: 1,
                      borderColor: overallTone === tone.value ? colors.accent : colors.border,
                    }}
                  >
                    <Text className="mr-2 text-base">{tone.emoji}</Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: overallTone === tone.value ? '#FFFFFF' : colors.textSecondary }}
                    >
                      {tone.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Tags / Keywords
              </Text>
              <TextInput
                value={tags}
                onChangeText={setTags}
                placeholder="Separate tags with commas (e.g., flying, water, family)"
                placeholderTextColor={colors.textTertiary}
                className="rounded-xl p-4 text-base"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
              />
            </View>

            {/* Personal Meaning */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Personal Meaning
              </Text>
              <TextInput
                value={personalMeaning}
                onChangeText={setPersonalMeaning}
                placeholder="What does this dream mean to you?"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="rounded-xl p-4 text-base"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  minHeight: 100,
                }}
              />
            </View>
          </View>
        </ScrollView>
        </TouchableWithoutFeedback>
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
  const { colors } = useTheme();
  
  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-semibold" style={{ color: colors.textPrimary }}>
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
              backgroundColor: value >= rating ? colors.accent : colors.cardBackground,
              borderWidth: 1,
              borderColor: value >= rating ? colors.accent : colors.border,
            }}
          >
            <Feather name={icon} size={24} color={value >= rating ? '#FFFFFF' : colors.textTertiary} />
            <Text
              className="mt-1 text-xs font-semibold"
              style={{ color: value >= rating ? '#FFFFFF' : colors.textSecondary }}
            >
              {rating}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

