import React from 'react';
import { Image, StyleSheet } from 'react-native';

export const Logo: React.FC = () => {
  return (
    <Image
      source={require('../../assets/full_black_tranparent.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
  },
});

