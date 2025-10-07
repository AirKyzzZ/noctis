import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMoon } from '../../providers/MoonContext';
import { useTheme } from '../../providers/ThemeContext';
import { 
  MoonPhaseCard, 
  ForecastCard, 
  RequestCounter 
} from '../../components/forecast';

export default function ForecastScreen() {
  const {
    dreamForecast,
    astronomyData,
    loading,
    error,
    refreshForecast,
    dailyRequestCount,
    remainingRequests,
  } = useMoon();

  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshForecast();
    setRefreshing(false);
  };

  // Loading state
  if (loading && !dreamForecast) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text className="mt-4" style={{ color: colors.textSecondary }}>
          Loading your prediction...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
            🔮 Dream Forecast
          </Text>
          <Text className="text-base mt-1" style={{ color: colors.textSecondary }}>
            Based on lunar cycles
          </Text>
        </View>

        {/* Request Counter */}
        <View className="px-6 mt-4">
          <RequestCounter 
            used={dailyRequestCount} 
            remaining={remainingRequests}
          />
        </View>

        {/* Error State */}
        {error && (
          <View className="mx-6 mt-4 rounded-2xl p-4" style={{ backgroundColor: isDark ? '#3D1A1A' : '#FEE2E2' }}>
            <Text className="font-semibold mb-1" style={{ color: '#DC2626' }}>
              Error
            </Text>
            <Text className="text-sm" style={{ color: '#DC2626' }}>
              {error}
            </Text>
            <TouchableOpacity
              className="mt-3 rounded-lg py-2"
              style={{ backgroundColor: '#DC2626' }}
              onPress={handleRefresh}
            >
              <Text className="text-white text-center font-semibold">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Content */}
        {dreamForecast && astronomyData && (
          <View className="px-6 mt-4">
            {/* Moon Phase Card */}
            <MoonPhaseCard 
              moonPhase={dreamForecast.moonPhase}
              moonFraction={dreamForecast.moonFraction}
            />

            {/* Forecast Card */}
            <ForecastCard forecast={dreamForecast} />

            {/* Astronomy Details */}
            <View className="rounded-3xl p-6 mb-4 shadow-sm" style={{ backgroundColor: colors.cardBackground }}>
              <Text className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                Astronomy Data
              </Text>
              
              <View className="space-y-3">
                {astronomyData.sunrise && (
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>🌅 Sunrise</Text>
                    <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {new Date(astronomyData.sunrise).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )}

                {astronomyData.sunset && (
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>🌇 Sunset</Text>
                    <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {new Date(astronomyData.sunset).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )}

                {astronomyData.moonrise && (
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>🌙 Moonrise</Text>
                    <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {new Date(astronomyData.moonrise).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )}

                {astronomyData.moonset && (
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>🌑 Moonset</Text>
                    <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {new Date(astronomyData.moonset).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                )}
              </View>

              <View className="mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text className="text-xs text-center" style={{ color: colors.textTertiary }}>
                  📍 France
                </Text>
              </View>
            </View>

            {/* Tips Section */}
            <View className="rounded-3xl p-6 mb-4" style={{ backgroundColor: colors.accent }}>
              <Text className="text-xl font-bold text-white mb-3">
                💡 Tips for Tonight
              </Text>
              <View className="space-y-2">
                <Text className="text-white text-sm leading-6 mb-2">
                  • Prepare your dream journal before sleeping
                </Text>
                <Text className="text-white text-sm leading-6 mb-2">
                  • Practice reality checks throughout the day
                </Text>
                <Text className="text-white text-sm leading-6 mb-2">
                  • Meditate for 10 minutes before bed
                </Text>
                <Text className="text-white text-sm leading-6">
                  • Avoid screens 1 hour before sleeping
                </Text>
              </View>
            </View>

            {/* Info about optimization */}
            <View className="rounded-2xl p-4 mb-4" style={{ backgroundColor: colors.accentLight }}>
              <Text className="text-xs leading-5" style={{ color: colors.textPrimary }}>
                <Text className="font-semibold">ℹ️ Optimization:</Text> Predictions are 
                cached to reduce API usage. Today's data will only require one API 
                request per day.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

