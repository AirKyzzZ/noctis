import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: '🌙',
    title: 'Capture Your Dreams',
    description: 'Record your dreams as soon as you wake up. Every detail matters in understanding your subconscious mind.',
  },
  {
    id: 2,
    icon: '📊',
    title: 'Track Patterns',
    description: 'Discover recurring themes, symbols, and emotions in your dreams. Gain insights into your inner world.',
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Search & Explore',
    description: 'Easily search through your dream journal. Find connections and explore your dream landscape.',
  },
  {
    id: 4,
    icon: '✨',
    title: 'Get Started',
    description: 'Begin your journey into the world of dreams. Your personal dream sanctuary awaits.',
  },
];

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.content}>
              <Text style={styles.icon}>{slide.icon}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {isLastSlide ? (
          <Pressable
            onPress={onComplete}
            className="active:opacity-80"
            style={[styles.button, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.buttonText}>Enter App</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={scrollToNext}
            className="active:opacity-80"
            style={[styles.button, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        )}
      </View>

      {/* Skip Button */}
      {!isLastSlide && (
        <Pressable
          onPress={onComplete}
          className="active:opacity-60"
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.accent,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});

