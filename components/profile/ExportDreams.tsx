import React, { useState } from 'react';
import { View, Text, Pressable, Alert, Modal, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';
import { useDreams } from '../../services/DreamService';
import { exportDreams, ExportFormat } from '../../services/ExportService';
import * as Sharing from 'expo-sharing';

interface ExportOption {
  id: ExportFormat;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

export const ExportDreams: React.FC = () => {
  const { colors } = useTheme();
  const { dreams } = useDreams();
  const [modalVisible, setModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const exportOptions: ExportOption[] = [
    {
      id: 'txt',
      title: 'Plain Text (.txt)',
      description: 'Simple text file with all your dreams',
      icon: 'file-text',
      color: '#3B82F6',
    },
    {
      id: 'json',
      title: 'JSON Format',
      description: 'Structured data format for backup',
      icon: 'code',
      color: '#8B5CF6',
    },
    {
      id: 'pdf',
      title: 'PDF Document',
      description: 'Formatted PDF with all dream details',
      icon: 'file',
      color: '#EF4444',
    },
    {
      id: 'csv',
      title: 'CSV Spreadsheet',
      description: 'Import into Excel or Google Sheets',
      icon: 'grid',
      color: '#10B981',
    },
  ];

  const handleExport = async (format: ExportFormat) => {
    if (dreams.length === 0) {
      Alert.alert('No Dreams', 'You don\'t have any dreams to export yet.');
      return;
    }

    setExporting(true);
    setExportingFormat(format);

    try {
      const { uri, fileName } = await exportDreams(dreams, format);
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: getMimeType(format),
          dialogTitle: `Export Dreams as ${format.toUpperCase()}`,
          UTI: getUTI(format),
        });
        
        setModalVisible(false);
        Alert.alert('Success', `Dreams exported successfully as ${fileName}`);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'There was an error exporting your dreams. Please try again.');
    } finally {
      setExporting(false);
      setExportingFormat(null);
    }
  };

  const getMimeType = (format: ExportFormat): string => {
    switch (format) {
      case 'txt':
        return 'text/plain';
      case 'json':
        return 'application/json';
      case 'pdf':
        return 'application/pdf';
      case 'csv':
        return 'text/csv';
      default:
        return 'text/plain';
    }
  };

  const getUTI = (format: ExportFormat): string => {
    switch (format) {
      case 'txt':
        return 'public.plain-text';
      case 'json':
        return 'public.json';
      case 'pdf':
        return 'com.adobe.pdf';
      case 'csv':
        return 'public.comma-separated-values-text';
      default:
        return 'public.plain-text';
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between py-4 px-4 rounded-xl active:opacity-80"
        style={{ backgroundColor: colors.cardBackground }}
      >
        <View className="flex-row items-center gap-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.accent + '20' }}
          >
            <Feather name="download" size={20} color={colors.accent} />
          </View>
          <View>
            <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
              Export Dreams
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Download your dreams in various formats
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !exporting && setModalVisible(false)}
      >
        <Pressable 
          className="flex-1 justify-end" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={() => !exporting && setModalVisible(false)}
        >
          <Pressable
            className="rounded-t-3xl"
            style={{ backgroundColor: colors.background }}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView 
              style={{ maxHeight: '85%' }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View className="pt-6 pb-8 px-6">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    Export Dreams
                  </Text>
                  <Pressable
                    onPress={() => !exporting && setModalVisible(false)}
                    disabled={exporting}
                    className="active:opacity-70"
                  >
                    <Feather name="x" size={24} color={colors.textPrimary} />
                  </Pressable>
                </View>

                {/* Info */}
                <View
                  className="flex-row items-center gap-3 p-4 rounded-xl mb-6"
                  style={{ backgroundColor: colors.gray100 }}
                >
                  <Feather name="info" size={20} color={colors.accent} />
                  <Text className="flex-1 text-sm" style={{ color: colors.textSecondary }}>
                    You have {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'} to export
                  </Text>
                </View>

                {/* Export Options */}
                <View className="gap-3 mb-6">
                  {exportOptions.map((option) => (
                    <Pressable
                      key={option.id}
                      onPress={() => handleExport(option.id)}
                      disabled={exporting}
                      className="p-4 rounded-xl active:opacity-80"
                      style={{ backgroundColor: colors.cardBackground }}
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-3 flex-1">
                          <View
                            className="w-12 h-12 rounded-xl items-center justify-center"
                            style={{ backgroundColor: option.color + '20' }}
                          >
                            <Feather name={option.icon} size={24} color={option.color} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                              {option.title}
                            </Text>
                            <Text className="text-sm" style={{ color: colors.textSecondary }}>
                              {option.description}
                            </Text>
                          </View>
                        </View>
                        {exporting && exportingFormat === option.id ? (
                          <ActivityIndicator color={option.color} />
                        ) : (
                          <Feather name="chevron-right" size={20} color={colors.textTertiary} />
                        )}
                      </View>
                      
                      {/* Dream Count Badge */}
                      <View 
                        className="flex-row items-center justify-center py-2 px-3 rounded-lg self-start"
                        style={{ backgroundColor: option.color + '15' }}
                      >
                        <Feather name="file-text" size={14} color={option.color} />
                        <Text 
                          className="text-sm font-semibold ml-2" 
                          style={{ color: option.color }}
                        >
                          {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'} ready to export
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>

                {/* Cloud Storage Info */}
                <View className="p-4 rounded-xl" style={{ backgroundColor: colors.gray100 }}>
                  <View className="flex-row items-start gap-3">
                    <Feather name="cloud" size={20} color={colors.accent} />
                    <View className="flex-1">
                      <Text className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                        Cloud Storage
                      </Text>
                      <Text className="text-xs" style={{ color: colors.textSecondary }}>
                        After exporting, use the share menu to save to Google Drive, iCloud, Dropbox, or any other cloud storage service available on your device.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

