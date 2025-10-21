import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, Platform, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';

// Conditionally import Voice module
let Voice: any = null;
let SpeechResultsEvent: any = null;
let SpeechErrorEvent: any = null;

try {
  const VoiceModule = require('@react-native-voice/voice');
  Voice = VoiceModule.default;
} catch (e) {
  console.log('Voice module not available - running in Expo Go. Use development build for voice features.');
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

export default function VoiceInput({ onTranscript, placeholder = 'Tap to record your dream' }: VoiceInputProps) {
  const { colors } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));
  const isVoiceAvailable = Voice !== null;

  useEffect(() => {
    if (!isVoiceAvailable) return;

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const onSpeechStart = () => {
    setIsRecording(true);
  };

  const onSpeechEnd = () => {
    setIsRecording(false);
  };

  const onSpeechResults = (event: any) => {
    if (event.value && event.value.length > 0) {
      const newTranscript = event.value[0];
      setTranscript(newTranscript);
      onTranscript(newTranscript);
    }
  };

  const onSpeechError = (event: any) => {
    console.error('Speech recognition error:', event.error);
    setIsRecording(false);
    
    if (event.error?.code === 'permissions') {
      Alert.alert(
        'Permission Required',
        'Please grant microphone and speech recognition permissions in your device settings to use voice input.',
        [{ text: 'OK' }]
      );
    } else if (event.error?.code !== 'no-speech') {
      Alert.alert(
        'Voice Recognition Error',
        'Failed to recognize speech. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const startRecording = async () => {
    try {
      setTranscript('');
      await Voice.start(Platform.OS === 'ios' ? 'en-US' : 'en_US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert(
        'Error',
        'Failed to start voice recognition. Please check your microphone permissions.',
        [{ text: 'OK' }]
      );
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const handlePress = () => {
    if (!isVoiceAvailable) {
      Alert.alert(
        'Voice Input Not Available',
        'Voice input requires a development build. Please run: npx expo run:ios',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View className="mb-4">
      <Pressable
        onPress={handlePress}
        className="items-center justify-center rounded-2xl p-6"
        style={{
          backgroundColor: colors.cardBackground,
          borderWidth: 2,
          borderColor: isRecording ? colors.accent : colors.border,
          borderStyle: isRecording ? 'solid' : 'dashed',
          opacity: isVoiceAvailable ? 1 : 0.6,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
        >
          <View
            className="mb-3 items-center justify-center rounded-full"
            style={{
              width: 64,
              height: 64,
              backgroundColor: isRecording ? colors.accent : colors.background,
            }}
          >
            <Feather
              name={isRecording ? 'mic' : 'mic-off'}
              size={32}
              color={isRecording ? '#FFFFFF' : colors.accent}
            />
          </View>
        </Animated.View>

        <Text
          className="mb-1 text-base font-semibold"
          style={{ color: isRecording ? colors.accent : colors.textPrimary }}
        >
          {isRecording ? 'Listening...' : isVoiceAvailable ? 'Voice Input' : 'Voice Input (Unavailable)'}
        </Text>

        <Text
          className="text-center text-sm"
          style={{ color: colors.textSecondary }}
        >
          {isRecording 
            ? 'Speak clearly to record your dream' 
            : isVoiceAvailable 
              ? placeholder 
              : 'Run dev build to use voice input'
          }
        </Text>

        {transcript && !isRecording && (
          <View className="mt-3 rounded-lg bg-opacity-50 p-3" style={{ backgroundColor: colors.accent + '20' }}>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Last transcription:
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.textPrimary }}>
              {transcript.substring(0, 100)}
              {transcript.length > 100 ? '...' : ''}
            </Text>
          </View>
        )}
      </Pressable>

      <View className="mt-2 flex-row items-center justify-center">
        <Feather name="info" size={14} color={colors.textTertiary} />
        <Text className="ml-1 text-xs" style={{ color: colors.textTertiary }}>
          {isRecording 
            ? 'Tap again to stop recording' 
            : isVoiceAvailable 
              ? 'Tap the microphone to start recording'
              : 'Available only in development builds'
          }
        </Text>
      </View>
    </View>
  );
}

