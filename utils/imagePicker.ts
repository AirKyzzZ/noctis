import { Alert, Platform } from 'react-native';

/**
 * Pick an image from the user's library
 * This is a placeholder that will work once expo-image-picker is installed
 */
export async function pickImage(): Promise<string | null> {
  try {
    // Dynamic import to avoid errors if package not installed yet
    const ImagePicker = await import('expo-image-picker');

    // Request permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'We need your permission to access your photos.'
        );
        return null;
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Image picker error:', error);
    Alert.alert(
      'Profile photo',
      'To enable photo selection, please install the required packages with: npm install'
    );
    return null;
  }
}

