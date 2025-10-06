import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../providers/ThemeContext';
import { useDreams } from '../../providers/DreamContext';
import { DreamType, OverallTone } from '../../types/dream';
import { SortOption } from './SortOptions';
import SearchHeader from './SearchHeader';
import SearchInput from './SearchInput';
import FilterToggle from './FilterToggle';
import SortOptions from './SortOptions';
import FiltersPanel from './FiltersPanel';
import EmptyState from './EmptyState';
import ResultsList from './ResultsList';

interface FilterState {
  searchText: string;
  dreamTypes: DreamType[];
  clarityMin: number;
  clarityMax: number;
  sleepQualityMin: number;
  sleepQualityMax: number;
  emotionalIntensityMin: number;
  emotionalIntensityMax: number;
  overallTones: OverallTone[];
  dateFrom: Date | null;
  dateTo: Date | null;
  sortBy: SortOption;
}

const initialFilters: FilterState = {
  searchText: '',
  dreamTypes: [],
  clarityMin: 1,
  clarityMax: 5,
  sleepQualityMin: 1,
  sleepQualityMax: 5,
  emotionalIntensityMin: 1,
  emotionalIntensityMax: 5,
  overallTones: [],
  dateFrom: null,
  dateTo: null,
  sortBy: 'date-desc',
};

export default function SearchContainer() {
  const { colors } = useTheme();
  const { dreams } = useDreams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const filteredDreams = useMemo(() => {
    let results = [...dreams];

    // Text search
    if (filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase();
      results = results.filter(dream =>
        dream.description.toLowerCase().includes(searchLower) ||
        dream.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        dream.characters.some(char => char.toLowerCase().includes(searchLower)) ||
        dream.location.toLowerCase().includes(searchLower) ||
        dream.personalMeaning.toLowerCase().includes(searchLower)
      );
    }

    // Dream type filter
    if (filters.dreamTypes.length > 0) {
      results = results.filter(dream => filters.dreamTypes.includes(dream.type));
    }

    // Clarity filter
    results = results.filter(
      dream => dream.clarity >= filters.clarityMin && dream.clarity <= filters.clarityMax
    );

    // Sleep quality filter
    results = results.filter(
      dream => dream.sleepQuality >= filters.sleepQualityMin && dream.sleepQuality <= filters.sleepQualityMax
    );

    // Emotional intensity filter
    results = results.filter(
      dream => dream.emotionalIntensity >= filters.emotionalIntensityMin && dream.emotionalIntensity <= filters.emotionalIntensityMax
    );

    // Overall tone filter
    if (filters.overallTones.length > 0) {
      results = results.filter(dream => filters.overallTones.includes(dream.overallTone));
    }

    // Date range filter
    if (filters.dateFrom) {
      results = results.filter(dream => new Date(dream.dateTime) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      results = results.filter(dream => new Date(dream.dateTime) <= endOfDay);
    }

    // Sort
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        case 'date-desc':
          return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
        case 'clarity-desc':
          return b.clarity - a.clarity;
        case 'clarity-asc':
          return a.clarity - b.clarity;
        case 'quality-desc':
          return b.sleepQuality - a.sleepQuality;
        default:
          return 0;
      }
    });

    return results;
  }, [dreams, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchText.trim()) count++;
    if (filters.dreamTypes.length > 0) count++;
    if (filters.clarityMin > 1 || filters.clarityMax < 5) count++;
    if (filters.sleepQualityMin > 1 || filters.sleepQualityMax < 5) count++;
    if (filters.emotionalIntensityMin > 1 || filters.emotionalIntensityMax < 5) count++;
    if (filters.overallTones.length > 0) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const toggleDreamType = (type: DreamType) => {
    setFilters(prev => ({
      ...prev,
      dreamTypes: prev.dreamTypes.includes(type)
        ? prev.dreamTypes.filter(t => t !== type)
        : [...prev.dreamTypes, type]
    }));
  };

  const toggleOverallTone = (tone: OverallTone) => {
    setFilters(prev => ({
      ...prev,
      overallTones: prev.overallTones.includes(tone)
        ? prev.overallTones.filter(t => t !== tone)
        : [...prev.overallTones, tone]
    }));
  };

  const dreamTypes: DreamType[] = ['ordinary', 'lucid', 'nightmare', 'recurring', 'prophetic', 'healing'];
  const tones: OverallTone[] = ['positive', 'negative', 'neutral', 'mixed'];

  return (
    <>
      {/* Header */}
      <View className="border-b px-4 pb-4 pt-2" style={{ borderBottomColor: colors.border }}>
        <SearchHeader activeFilterCount={activeFilterCount} onClearFilters={resetFilters} />

        <SearchInput
          value={filters.searchText}
          onChangeText={text => setFilters(prev => ({ ...prev, searchText: text }))}
        />

        {/* Filter Toggle & Sort */}
        <View className="flex-row items-center justify-between">
          <FilterToggle
            showFilters={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
            activeFilterCount={activeFilterCount}
          />

          <SortOptions
            selectedSort={filters.sortBy}
            onSortChange={sortBy => setFilters(prev => ({ ...prev, sortBy }))}
          />
        </View>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <FiltersPanel
          dreamTypes={dreamTypes}
          selectedDreamTypes={filters.dreamTypes}
          onToggleDreamType={toggleDreamType}
          tones={tones}
          selectedTones={filters.overallTones}
          onToggleTone={toggleOverallTone}
          clarityMin={filters.clarityMin}
          clarityMax={filters.clarityMax}
          onClarityMinChange={val => setFilters(prev => ({ ...prev, clarityMin: val }))}
          onClarityMaxChange={val => setFilters(prev => ({ ...prev, clarityMax: val }))}
          sleepQualityMin={filters.sleepQualityMin}
          sleepQualityMax={filters.sleepQualityMax}
          onSleepQualityMinChange={val => setFilters(prev => ({ ...prev, sleepQualityMin: val }))}
          onSleepQualityMaxChange={val => setFilters(prev => ({ ...prev, sleepQualityMax: val }))}
          emotionalIntensityMin={filters.emotionalIntensityMin}
          emotionalIntensityMax={filters.emotionalIntensityMax}
          onEmotionalIntensityMinChange={val => setFilters(prev => ({ ...prev, emotionalIntensityMin: val }))}
          onEmotionalIntensityMaxChange={val => setFilters(prev => ({ ...prev, emotionalIntensityMax: val }))}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
        />
      )}

      {/* Results */}
      <View className="flex-1">
        {filteredDreams.length === 0 ? (
          <EmptyState hasActiveFilters={activeFilterCount > 0} />
        ) : (
          <ResultsList dreams={filteredDreams} />
        )}
      </View>
    </>
  );
}

