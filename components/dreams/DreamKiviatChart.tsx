import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Circle, Polygon, Line, Text as SvgText } from 'react-native-svg';
import { Dream } from '../../types/dream';
import { useTheme } from '../../services/ThemeService';

interface DreamKiviatChartProps {
  dream: Dream;
}

interface ChartData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const DreamKiviatChart: React.FC<DreamKiviatChartProps> = ({ dream }) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const padding = 32; // Padding for container
  const svgSize = Math.min(screenWidth - padding, 360); // SVG container size
  const center = svgSize / 2;
  const radius = svgSize / 2 - 80; // Larger chart radius
  const levels = 5;

  // Prepare chart data - normalized emotional states to numeric values
  const getEmotionalScore = (state: string): number => {
    const emotionalScores: Record<string, number> = {
      peaceful: 5,
      happy: 5,
      calm: 4,
      excited: 4,
      restless: 3,
      anxious: 2,
      sad: 2,
      fearful: 1,
    };
    return emotionalScores[state] || 3;
  };

  const chartData: ChartData[] = [
    {
      label: 'Sleep\nQuality',
      value: dream.sleepQuality,
      maxValue: 5,
      color: colors.accent,
    },
    {
      label: 'Intensity',
      value: dream.emotionalIntensity,
      maxValue: 5,
      color: colors.accent,
    },
    {
      label: 'Dream\nClarity',
      value: dream.clarity,
      maxValue: 5,
      color: colors.accent,
    },
    {
      label: 'State\nBefore',
      value: getEmotionalScore(dream.emotionalStateBefore),
      maxValue: 5,
      color: colors.accent,
    },
    {
      label: 'State\nAfter',
      value: getEmotionalScore(dream.emotionalStateAfter),
      maxValue: 5,
      color: colors.accent,
    },
  ];

  const angleSlice = (Math.PI * 2) / chartData.length;

  // Calculate point coordinates on the chart
  const getCoordinatesForValue = (
    dataIndex: number,
    value: number,
    maxValue: number
  ): { x: number; y: number } => {
    const angle = angleSlice * dataIndex - Math.PI / 2;
    const normalizedValue = (value / maxValue) * radius;
    const x = center + normalizedValue * Math.cos(angle);
    const y = center + normalizedValue * Math.sin(angle);
    return { x, y };
  };

  // Calculate label position (outside the chart)
  const getLabelPosition = (dataIndex: number): { x: number; y: number } => {
    const angle = angleSlice * dataIndex - Math.PI / 2;
    const labelDistance = radius + 20;
    const x = center + labelDistance * Math.cos(angle);
    const y = center + labelDistance * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string for the data
  const getPolygonPoints = (): string => {
    return chartData
      .map((data, index) => {
        const { x, y } = getCoordinatesForValue(index, data.value, data.maxValue);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Generate circles for grid levels
  const renderGridLevels = () => {
    return Array.from({ length: levels }).map((_, index) => {
      const levelRadius = (radius / levels) * (index + 1);
      return (
        <Circle
          key={`level-${index}`}
          cx={center}
          cy={center}
          r={levelRadius}
          stroke={colors.border}
          strokeWidth="1"
          fill="none"
        />
      );
    });
  };

  // Generate axis lines
  const renderAxisLines = () => {
    return chartData.map((_, index) => {
      const angle = angleSlice * index - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return (
        <Line
          key={`axis-${index}`}
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke={colors.border}
          strokeWidth="1"
        />
      );
    });
  };

  // Render axis labels
  const renderLabels = () => {
    return chartData.map((data, index) => {
      const { x, y } = getLabelPosition(index);
      const angle = angleSlice * index - Math.PI / 2;
      
      // Split label by newline for multi-line rendering
      const labelLines = data.label.split('\n');
      const lineHeight = 14;
      const totalHeight = labelLines.length * lineHeight;
      const startY = y - totalHeight / 2 + lineHeight / 2;

      return (
        <React.Fragment key={`label-${index}`}>
          {labelLines.map((line, lineIndex) => {
            // Adjust text anchor based on position
            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            if (Math.cos(angle) > 0.1) textAnchor = 'start';
            if (Math.cos(angle) < -0.1) textAnchor = 'end';

            return (
              <SvgText
                key={`${index}-${lineIndex}`}
                x={x}
                y={startY + lineIndex * lineHeight}
                fontSize="11"
                fontWeight="600"
                fill={colors.textSecondary}
                textAnchor={textAnchor}
              >
                {line}
              </SvgText>
            );
          })}
        </React.Fragment>
      );
    });
  };

  // Render value dots on the polygon
  const renderValueDots = () => {
    return chartData.map((data, index) => {
      const { x, y } = getCoordinatesForValue(index, data.value, data.maxValue);
      return (
        <Circle
          key={`dot-${index}`}
          cx={x}
          cy={y}
          r="4"
          fill={colors.accent}
          stroke={colors.cardBackground}
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <View className="mb-5">
      <Text className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>
        Dream Analysis Chart
      </Text>
      <View className="items-center rounded-xl p-6" style={{ backgroundColor: colors.cardBackground }}>
        <Svg width={svgSize} height={svgSize}>
          {/* Grid levels */}
          {renderGridLevels()}

          {/* Axis lines */}
          {renderAxisLines()}

          {/* Data polygon */}
          <Polygon
            points={getPolygonPoints()}
            fill={colors.accent}
            fillOpacity="0.25"
            stroke={colors.accent}
            strokeWidth="2"
          />

          {/* Value dots */}
          {renderValueDots()}

          {/* Labels */}
          {renderLabels()}
        </Svg>

        {/* Legend */}
        <View className="mt-6 w-full">
          <Text className="mb-3 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textTertiary }}>
            Metric Values
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {chartData.map((data, index) => (
              <View key={`legend-${index}`} className="mb-2 mr-4 flex-row items-center">
                <View className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  {data.label.replace('\n', ' ')}: {data.value}/{data.maxValue}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Additional insight */}
        <View className="mt-4 rounded-lg p-3" style={{ backgroundColor: colors.gray100 }}>
          <Text className="text-center text-xs leading-5" style={{ color: colors.textSecondary }}>
            This radar chart visualizes the different aspects of your dream experience, 
            helping you identify patterns and areas of focus in your dream journey.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DreamKiviatChart;

