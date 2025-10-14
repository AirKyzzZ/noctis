import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '../../services/ThemeService';
import { DreamType, OverallTone } from '../../types/dream';
import FilterSection from './FilterSection';
import ChipSelector from './ChipSelector';
import RangeSelector from './RangeSelector';

interface FiltersPanelProps {
  dreamTypes: DreamType[];
  selectedDreamTypes: DreamType[];
  onToggleDreamType: (type: DreamType) => void;
  
  tones: OverallTone[];
  selectedTones: OverallTone[];
  onToggleTone: (tone: OverallTone) => void;
  
  clarityMin: number;
  clarityMax: number;
  onClarityMinChange: (val: number) => void;
  onClarityMaxChange: (val: number) => void;
  
  sleepQualityMin: number;
  sleepQualityMax: number;
  onSleepQualityMinChange: (val: number) => void;
  onSleepQualityMaxChange: (val: number) => void;
  
  emotionalIntensityMin: number;
  emotionalIntensityMax: number;
  onEmotionalIntensityMinChange: (val: number) => void;
  onEmotionalIntensityMaxChange: (val: number) => void;
  
  expandedSections: string[];
  onToggleSection: (section: string) => void;
}

export default function FiltersPanel({
  dreamTypes,
  selectedDreamTypes,
  onToggleDreamType,
  tones,
  selectedTones,
  onToggleTone,
  clarityMin,
  clarityMax,
  onClarityMinChange,
  onClarityMaxChange,
  sleepQualityMin,
  sleepQualityMax,
  onSleepQualityMinChange,
  onSleepQualityMaxChange,
  emotionalIntensityMin,
  emotionalIntensityMax,
  onEmotionalIntensityMinChange,
  onEmotionalIntensityMaxChange,
  expandedSections,
  onToggleSection,
}: FiltersPanelProps) {
  const { colors } = useTheme();

  return (
    <ScrollView 
      className="border-b px-4 py-4" 
      style={{ borderBottomColor: colors.border, maxHeight: 400 }}
    >
      {/* Dream Types */}
      <FilterSection
        title="Dream Types"
        isExpanded={expandedSections.includes('dreamTypes')}
        onToggle={() => onToggleSection('dreamTypes')}
      >
        <ChipSelector
          options={dreamTypes}
          selectedOptions={selectedDreamTypes}
          onToggle={onToggleDreamType}
        />
      </FilterSection>

      {/* Clarity Range */}
      <FilterSection
        title="Clarity Range"
        isExpanded={expandedSections.includes('clarity')}
        onToggle={() => onToggleSection('clarity')}
      >
        <RangeSelector
          currentMin={clarityMin}
          currentMax={clarityMax}
          onMinChange={onClarityMinChange}
          onMaxChange={onClarityMaxChange}
        />
      </FilterSection>

      {/* Sleep Quality Range */}
      <FilterSection
        title="Sleep Quality Range"
        isExpanded={expandedSections.includes('sleepQuality')}
        onToggle={() => onToggleSection('sleepQuality')}
      >
        <RangeSelector
          currentMin={sleepQualityMin}
          currentMax={sleepQualityMax}
          onMinChange={onSleepQualityMinChange}
          onMaxChange={onSleepQualityMaxChange}
        />
      </FilterSection>

      {/* Emotional Intensity Range */}
      <FilterSection
        title="Emotional Intensity Range"
        isExpanded={expandedSections.includes('emotionalIntensity')}
        onToggle={() => onToggleSection('emotionalIntensity')}
      >
        <RangeSelector
          currentMin={emotionalIntensityMin}
          currentMax={emotionalIntensityMax}
          onMinChange={onEmotionalIntensityMinChange}
          onMaxChange={onEmotionalIntensityMaxChange}
        />
      </FilterSection>

      {/* Overall Tone */}
      <FilterSection
        title="Overall Tone"
        isExpanded={expandedSections.includes('overallTone')}
        onToggle={() => onToggleSection('overallTone')}
      >
        <ChipSelector
          options={tones}
          selectedOptions={selectedTones}
          onToggle={onToggleTone}
        />
      </FilterSection>
    </ScrollView>
  );
}

