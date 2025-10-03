import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ConfettiPiece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  color: string;
  initialX: number;
}

export const ConfettiEffect: React.FC = () => {
  const confettiPieces = useRef<ConfettiPiece[]>([]);
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  useEffect(() => {
    // Create confetti pieces
    confettiPieces.current = Array.from({ length: 40 }, () => {
      const initialX = Math.random() * width;
      return {
        x: new Animated.Value(initialX),
        y: new Animated.Value(-20),
        rotate: new Animated.Value(0),
        color: colors[Math.floor(Math.random() * colors.length)],
        initialX,
      };
    });

    // Animate confetti
    const animations = confettiPieces.current.map((piece) => {
      return Animated.parallel([
        Animated.timing(piece.y, {
          toValue: height + 100,
          duration: 5000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.x, {
          toValue: piece.initialX + (Math.random() - 0.5) * 100,
          duration: 5000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(piece.rotate, {
            toValue: 360,
            duration: 1000 + Math.random() * 1000,
            useNativeDriver: true,
          })
        ),
      ]);
    });

    Animated.stagger(50, animations).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});

