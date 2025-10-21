import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDreams } from '../../services/DreamService';
import { useTheme } from '../../services/ThemeService';
import { format } from '../../utils/dateFormat';
import { DreamKiviatChart } from '../../components/dreams';
import {
  DreamType,
  EmotionalState,
  OverallTone,
  SleepQuality,
  EmotionalIntensity,
  DreamClarity,
  Dream,
  LucidDreamTechnique,
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

const lucidTechniques: { value: LucidDreamTechnique; label: string; description: string }[] = [
  { value: 'MILD', label: 'MILD', description: 'Mnemonic Induction' },
  { value: 'WBTB', label: 'WBTB', description: 'Wake Back To Bed' },
  { value: 'FILD', label: 'FILD', description: 'Finger Induced' },
  { value: 'WILD', label: 'WILD', description: 'Wake Initiated' },
  { value: 'DILD', label: 'DILD', description: 'Dream Initiated' },
  { value: 'SSILD', label: 'SSILD', description: 'Senses Initiated' },
  { value: 'CAT', label: 'CAT', description: 'Cycle Adjustment' },
  { value: 'DEILD', label: 'DEILD', description: 'Dream Exit Induced' },
  { value: 'Reality Check', label: 'Reality Check', description: 'Reality Testing' },
  { value: 'Other', label: 'Other', description: 'Other Technique' },
];

export default function DreamDetailScreen() {
  const router = useRouter();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { getDreamById, updateDream, deleteDream } = useDreams();
  const { colors } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [dream, setDream] = useState<Dream | null>(null);

  const handleGoBack = () => {
    // Navigate back to where the user came from
    if (from === 'search') {
      router.push('/(tabs)/search');
    } else if (from === 'dreams') {
      router.push('/(tabs)/dreams');
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/dreams');
    }
  };

  // Editable fields
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
  const [selectedLucidTechniques, setSelectedLucidTechniques] = useState<LucidDreamTechnique[]>([]);

  useEffect(() => {
    if (id) {
      const foundDream = getDreamById(id);
      if (foundDream) {
        setDream(foundDream);
        initializeFields(foundDream);
      } else {
        Alert.alert('Error', 'Dream not found');
        handleGoBack();
      }
    }
  }, [id]);

  const initializeFields = (dreamData: Dream) => {
    setDreamType(dreamData.type);
    setDescription(dreamData.description);
    setEmotionalStateBefore(dreamData.emotionalStateBefore);
    setEmotionalStateAfter(dreamData.emotionalStateAfter);
    setCharacters(dreamData.characters.join(', '));
    setLocation(dreamData.location);
    setEmotionalIntensity(dreamData.emotionalIntensity);
    setClarity(dreamData.clarity);
    setTags(dreamData.tags.join(', '));
    setSleepQuality(dreamData.sleepQuality);
    setPersonalMeaning(dreamData.personalMeaning);
    setOverallTone(dreamData.overallTone);
    setSelectedLucidTechniques(dreamData.lucidTechniques || []);
  };

  const handleSave = async () => {
    if (!description.trim() || !dream) {
      Alert.alert('Missing Information', 'Please provide a dream description.');
      return;
    }

    try {
      const charactersList = characters
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const tagsList = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await updateDream(dream.id, {
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
        lucidTechniques: dreamType === 'lucid' && selectedLucidTechniques.length > 0 ? selectedLucidTechniques : undefined,
      });

      setIsEditing(false);
      const updatedDream = getDreamById(dream.id);
      if (updatedDream) {
        setDream(updatedDream);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update dream. Please try again.');
      console.error('Error updating dream:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Dream',
      'Are you sure you want to delete this dream entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (dream) {
              await deleteDream(dream.id);
              handleGoBack();
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (dream) {
      initializeFields(dream);
    }
    setIsEditing(false);
  };

  if (!dream) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textSecondary }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b px-4 py-3" style={{ borderBottomColor: colors.border }}>
          <Pressable onPress={handleGoBack} hitSlop={12}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {isEditing ? 'Edit Dream' : 'Dream Details'}
          </Text>
          <View className="flex-row items-center">
            {isEditing ? (
              <>
                <Pressable onPress={handleCancel} hitSlop={12} className="mr-3">
                  <Text className="text-base" style={{ color: colors.textSecondary }}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable onPress={handleSave} hitSlop={12}>
                  <Text className="text-base font-semibold" style={{ color: colors.accent }}>
                    Save
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable onPress={handleDelete} hitSlop={12} className="mr-3">
                  <Feather name="trash-2" size={20} color="#EF4444" />
                </Pressable>
                <Pressable onPress={() => setIsEditing(true)} hitSlop={12}>
                  <Feather name="edit-2" size={20} color={colors.accent} />
                </Pressable>
              </>
            )}
          </View>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-5">
            {/* Date info */}
            {!isEditing && (
              <View className="mb-6 rounded-xl bg-white p-4">
                <Text className="mb-1 text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
                  Dream Date
                </Text>
                <Text className="text-base font-semibold" style={{ color: '#1F2937' }}>
                  {format(new Date(dream.dateTime), 'MMM dd, yyyy • hh:mm a')}
                </Text>
              </View>
            )}

            {isEditing ? (
              <>
                {/* Editable fields - Same as Add screen */}
                <EditFields
                  dreamType={dreamType}
                  setDreamType={setDreamType}
                  description={description}
                  setDescription={setDescription}
                  emotionalStateBefore={emotionalStateBefore}
                  setEmotionalStateBefore={setEmotionalStateBefore}
                  emotionalStateAfter={emotionalStateAfter}
                  setEmotionalStateAfter={setEmotionalStateAfter}
                  characters={characters}
                  setCharacters={setCharacters}
                  location={location}
                  setLocation={setLocation}
                  sleepQuality={sleepQuality}
                  setSleepQuality={setSleepQuality}
                  emotionalIntensity={emotionalIntensity}
                  setEmotionalIntensity={setEmotionalIntensity}
                  clarity={clarity}
                  setClarity={setClarity}
                  overallTone={overallTone}
                  setOverallTone={setOverallTone}
                  tags={tags}
                  setTags={setTags}
                  personalMeaning={personalMeaning}
                  setPersonalMeaning={setPersonalMeaning}
                  selectedLucidTechniques={selectedLucidTechniques}
                  setSelectedLucidTechniques={setSelectedLucidTechniques}
                />
              </>
            ) : (
              <>
                {/* Read-only view */}
                <ReadOnlyView dream={dream} />
              </>
            )}
          </View>
        </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Read-only view components
function ReadOnlyView({ dream }: { dream: Dream }) {
  const dreamTypeInfo = dreamTypes.find((t) => t.value === dream.type);
  const toneInfo = overallTones.find((t) => t.value === dream.overallTone);

  return (
    <>
      {/* Type */}
      <InfoSection title="Dream Type">
        <View className="flex-row items-center">
          <Text className="mr-2 text-2xl">{dreamTypeInfo?.icon}</Text>
          <Text className="text-base font-semibold capitalize" style={{ color: '#1F2937' }}>
            {dreamTypeInfo?.label}
          </Text>
        </View>
      </InfoSection>

      {/* Description */}
      <InfoSection title="Description">
        <Text className="text-base leading-6" style={{ color: '#4B5563' }}>
          {dream.description}
        </Text>
      </InfoSection>

      {/* Emotional States */}
      <InfoSection title="Emotional Journey">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
              Before Sleep
            </Text>
            <View className="rounded-lg bg-gray-50 px-3 py-2">
              <Text className="text-sm font-semibold capitalize" style={{ color: '#1F2937' }}>
                {dream.emotionalStateBefore}
              </Text>
            </View>
          </View>
          <Feather name="arrow-right" size={20} color="#9CA3AF" style={{ marginHorizontal: 12 }} />
          <View className="flex-1">
            <Text className="mb-1 text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
              After Waking
            </Text>
            <View className="rounded-lg bg-gray-50 px-3 py-2">
              <Text className="text-sm font-semibold capitalize" style={{ color: '#1F2937' }}>
                {dream.emotionalStateAfter}
              </Text>
            </View>
          </View>
        </View>
      </InfoSection>

      {/* Characters */}
      {dream.characters.length > 0 && (
        <InfoSection title="Characters">
          <View className="flex-row flex-wrap">
            {dream.characters.map((character, index) => (
              <View key={index} className="mb-2 mr-2 rounded-lg bg-purple-50 px-3 py-2">
                <Text className="text-sm" style={{ color: '#8B5CF6' }}>
                  {character}
                </Text>
              </View>
            ))}
          </View>
        </InfoSection>
      )}

      {/* Location */}
      {dream.location && (
        <InfoSection title="Location">
          <View className="flex-row items-center">
            <Feather name="map-pin" size={16} color="#6B7280" />
            <Text className="ml-2 text-base" style={{ color: '#4B5563' }}>
              {dream.location}
            </Text>
          </View>
        </InfoSection>
      )}

      {/* Ratings */}
      <InfoSection title="Ratings">
        <View className="space-y-3">
          <RatingDisplay icon="moon" label="Sleep Quality" value={dream.sleepQuality} />
          <RatingDisplay icon="zap" label="Emotional Intensity" value={dream.emotionalIntensity} />
          <RatingDisplay icon="eye" label="Clarity" value={dream.clarity} />
        </View>
      </InfoSection>

      {/* Overall Tone */}
      <InfoSection title="Overall Tone">
        <View className="flex-row items-center">
          <Text className="mr-2 text-2xl">{toneInfo?.emoji}</Text>
          <Text className="text-base font-semibold capitalize" style={{ color: '#1F2937' }}>
            {toneInfo?.label}
          </Text>
        </View>
      </InfoSection>

      {/* Tags */}
      {dream.tags.length > 0 && (
        <InfoSection title="Tags">
          <View className="flex-row flex-wrap">
            {dream.tags.map((tag, index) => (
              <View key={index} className="mb-2 mr-2 rounded-full bg-gray-100 px-3 py-1.5">
                <Text className="text-sm" style={{ color: '#6B7280' }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </InfoSection>
      )}

      {/* Personal Meaning */}
      {dream.personalMeaning && (
        <InfoSection title="Personal Meaning">
          <Text className="text-base leading-6" style={{ color: '#4B5563' }}>
            {dream.personalMeaning}
          </Text>
        </InfoSection>
      )}

      {/* Lucid Dream Techniques */}
      {dream.type === 'lucid' && dream.lucidTechniques && dream.lucidTechniques.length > 0 && (
        <InfoSection title="Lucid Dream Techniques">
          <View className="flex-row flex-wrap">
            {dream.lucidTechniques.map((technique, index) => {
              const techniqueInfo = lucidTechniques.find(t => t.value === technique);
              return (
                <View key={index} className="mb-2 mr-2 rounded-lg bg-indigo-50 px-3 py-2">
                  <Text className="text-sm font-semibold" style={{ color: '#6366F1' }}>
                    {techniqueInfo?.label || technique}
                  </Text>
                  {techniqueInfo?.description && (
                    <Text className="text-xs mt-0.5" style={{ color: '#818CF8' }}>
                      {techniqueInfo.description}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </InfoSection>
      )}

      {/* Kiviat Chart */}
      <DreamKiviatChart dream={dream} />
    </>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>
        {title}
      </Text>
      <View className="rounded-xl bg-white p-4">{children}</View>
    </View>
  );
}

function RatingDisplay({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <View className="flex-row items-center">
        <Feather name={icon} size={16} color="#6B7280" />
        <Text className="ml-2 text-sm" style={{ color: '#6B7280' }}>
          {label}
        </Text>
      </View>
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <View
            key={rating}
            className="ml-1 h-2 w-2 rounded-full"
            style={{ backgroundColor: rating <= value ? '#8B5CF6' : '#E5E7EB' }}
          />
        ))}
        <Text className="ml-2 text-sm font-semibold" style={{ color: '#1F2937' }}>
          {value}/5
        </Text>
      </View>
    </View>
  );
}

// Edit fields (reusing from Add screen)
interface EditFieldsProps {
  dreamType: DreamType;
  setDreamType: (type: DreamType) => void;
  description: string;
  setDescription: (desc: string) => void;
  emotionalStateBefore: EmotionalState;
  setEmotionalStateBefore: (state: EmotionalState) => void;
  emotionalStateAfter: EmotionalState;
  setEmotionalStateAfter: (state: EmotionalState) => void;
  characters: string;
  setCharacters: (chars: string) => void;
  location: string;
  setLocation: (loc: string) => void;
  sleepQuality: SleepQuality;
  setSleepQuality: (quality: SleepQuality) => void;
  emotionalIntensity: EmotionalIntensity;
  setEmotionalIntensity: (intensity: EmotionalIntensity) => void;
  clarity: DreamClarity;
  setClarity: (clarity: DreamClarity) => void;
  overallTone: OverallTone;
  setOverallTone: (tone: OverallTone) => void;
  tags: string;
  setTags: (tags: string) => void;
  personalMeaning: string;
  setPersonalMeaning: (meaning: string) => void;
  selectedLucidTechniques: LucidDreamTechnique[];
  setSelectedLucidTechniques: (techniques: LucidDreamTechnique[]) => void;
}

function EditFields(props: EditFieldsProps) {
  return (
    <>
      {/* Dream Type */}
      <View className="mb-6">
        <Text className="mb-3 text-sm font-semibold" style={{ color: '#374151' }}>
          Dream Type
        </Text>
        <View className="flex-row flex-wrap">
          {dreamTypes.map((type) => (
            <Pressable
              key={type.value}
              onPress={() => props.setDreamType(type.value)}
              className="mb-2 mr-2 flex-row items-center rounded-xl px-4 py-3"
              style={{
                backgroundColor: props.dreamType === type.value ? '#8B5CF6' : '#FFFFFF',
                borderWidth: 1,
                borderColor: props.dreamType === type.value ? '#8B5CF6' : '#E5E7EB',
              }}
            >
              <Text className="mr-2 text-base">{type.icon}</Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: props.dreamType === type.value ? '#FFFFFF' : '#4B5563' }}
              >
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Lucid Dream Techniques - Only show when dream type is lucid */}
      {props.dreamType === 'lucid' && (
        <View className="mb-6">
          <Text className="mb-2 text-sm font-semibold" style={{ color: '#374151' }}>
            Lucid Dream Techniques Used (Optional)
          </Text>
          <Text className="mb-3 text-xs" style={{ color: '#9CA3AF' }}>
            Select the techniques you used to induce this lucid dream
          </Text>
          <View className="flex-row flex-wrap">
            {lucidTechniques.map((technique) => (
              <Pressable
                key={technique.value}
                onPress={() => {
                  props.setSelectedLucidTechniques(
                    props.selectedLucidTechniques.includes(technique.value)
                      ? props.selectedLucidTechniques.filter(t => t !== technique.value)
                      : [...props.selectedLucidTechniques, technique.value]
                  );
                }}
                className="mb-2 mr-2 rounded-xl px-3 py-2"
                style={{
                  backgroundColor: props.selectedLucidTechniques.includes(technique.value) 
                    ? '#8B5CF6' 
                    : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: props.selectedLucidTechniques.includes(technique.value) 
                    ? '#8B5CF6' 
                    : '#E5E7EB',
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ 
                    color: props.selectedLucidTechniques.includes(technique.value) 
                      ? '#FFFFFF' 
                      : '#4B5563' 
                  }}
                >
                  {technique.label}
                </Text>
                <Text
                  className="text-xs mt-0.5"
                  style={{ 
                    color: props.selectedLucidTechniques.includes(technique.value) 
                      ? '#FFFFFF' 
                      : '#9CA3AF' 
                  }}
                >
                  {technique.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Dream Description */}
      <View className="mb-6">
        <Text className="mb-2 text-sm font-semibold" style={{ color: '#374151' }}>
          Dream Description *
        </Text>
        <TextInput
          value={props.description}
          onChangeText={props.setDescription}
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
              onPress={() => props.setEmotionalStateBefore(state.value)}
              className="mb-2 mr-2 rounded-xl px-4 py-2.5"
              style={{
                backgroundColor: props.emotionalStateBefore === state.value ? '#8B5CF6' : '#FFFFFF',
                borderWidth: 1,
                borderColor: props.emotionalStateBefore === state.value ? '#8B5CF6' : '#E5E7EB',
              }}
            >
              <Text
                className="text-sm"
                style={{ color: props.emotionalStateBefore === state.value ? '#FFFFFF' : '#4B5563' }}
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
              onPress={() => props.setEmotionalStateAfter(state.value)}
              className="mb-2 mr-2 rounded-xl px-4 py-2.5"
              style={{
                backgroundColor: props.emotionalStateAfter === state.value ? '#8B5CF6' : '#FFFFFF',
                borderWidth: 1,
                borderColor: props.emotionalStateAfter === state.value ? '#8B5CF6' : '#E5E7EB',
              }}
            >
              <Text
                className="text-sm"
                style={{ color: props.emotionalStateAfter === state.value ? '#FFFFFF' : '#4B5563' }}
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
          value={props.characters}
          onChangeText={props.setCharacters}
          placeholder="Separate names with commas"
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
          value={props.location}
          onChangeText={props.setLocation}
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

      <RatingField
        label="Sleep Quality"
        value={props.sleepQuality}
        onChange={(val) => props.setSleepQuality(val as SleepQuality)}
        icon="moon"
      />

      <RatingField
        label="Emotional Intensity"
        value={props.emotionalIntensity}
        onChange={(val) => props.setEmotionalIntensity(val as EmotionalIntensity)}
        icon="zap"
      />

      <RatingField
        label="Dream Clarity"
        value={props.clarity}
        onChange={(val) => props.setClarity(val as DreamClarity)}
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
              onPress={() => props.setOverallTone(tone.value)}
              className="mb-2 mr-2 flex-row items-center rounded-xl px-4 py-3"
              style={{
                backgroundColor: props.overallTone === tone.value ? '#8B5CF6' : '#FFFFFF',
                borderWidth: 1,
                borderColor: props.overallTone === tone.value ? '#8B5CF6' : '#E5E7EB',
              }}
            >
              <Text className="mr-2 text-base">{tone.emoji}</Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: props.overallTone === tone.value ? '#FFFFFF' : '#4B5563' }}
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
          value={props.tags}
          onChangeText={props.setTags}
          placeholder="Separate tags with commas"
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
          value={props.personalMeaning}
          onChangeText={props.setPersonalMeaning}
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
    </>
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

