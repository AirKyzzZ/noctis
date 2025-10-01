module.exports = {
  useFonts: () => [true],
  Font: {
    isLoaded: () => true,
    // no-op async loader used by @expo/vector-icons
    loadAsync: async () => {},
  },
};


