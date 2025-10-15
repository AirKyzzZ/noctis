import { Paths, File } from 'expo-file-system';
import * as Print from 'expo-print';
import { Dream } from '../types/dream';
import { formatDate } from '../utils/dateFormat';

export type ExportFormat = 'txt' | 'json' | 'pdf' | 'csv';

interface ExportResult {
  uri: string;
  fileName: string;
}

/**
 * Exports dreams to various formats
 */
export const exportDreams = async (dreams: Dream[], format: ExportFormat): Promise<ExportResult> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `noctis-dreams-${timestamp}.${format}`;
  const file = new File(Paths.cache, fileName);
  const fileUri = file.uri;

  switch (format) {
    case 'txt':
      return await exportToTxt(dreams, fileUri, fileName);
    case 'json':
      return await exportToJson(dreams, fileUri, fileName);
    case 'pdf':
      return await exportToPdf(dreams, fileName);
    case 'csv':
      return await exportToCsv(dreams, fileUri, fileName);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Export dreams to plain text format
 */
const exportToTxt = async (dreams: Dream[], fileUri: string, fileName: string): Promise<ExportResult> => {
  const sortedDreams = [...dreams].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  let content = '='.repeat(80) + '\n';
  content += '                        NOCTIS DREAM JOURNAL\n';
  content += '='.repeat(80) + '\n\n';
  content += `Exported: ${new Date().toLocaleString()}\n`;
  content += `Total Dreams: ${dreams.length}\n`;
  content += '='.repeat(80) + '\n\n';

  sortedDreams.forEach((dream, index) => {
    content += `\n${'─'.repeat(80)}\n`;
    content += `DREAM #${sortedDreams.length - index}\n`;
    content += `${'─'.repeat(80)}\n\n`;
    
    content += `Date & Time: ${formatDate(new Date(dream.dateTime), 'full')}\n`;
    content += `Type: ${capitalizeFirst(dream.type)}\n`;
    content += `Location: ${dream.location}\n\n`;
    
    content += `DESCRIPTION:\n${dream.description}\n\n`;
    
    if (dream.personalMeaning) {
      content += `PERSONAL MEANING:\n${dream.personalMeaning}\n\n`;
    }
    
    content += `EMOTIONAL STATE:\n`;
    content += `  Before Sleep: ${capitalizeFirst(dream.emotionalStateBefore)}\n`;
    content += `  After Waking: ${capitalizeFirst(dream.emotionalStateAfter)}\n\n`;
    
    content += `METRICS:\n`;
    content += `  Sleep Quality: ${dream.sleepQuality}/5\n`;
    content += `  Clarity: ${dream.clarity}/5\n`;
    content += `  Emotional Intensity: ${dream.emotionalIntensity}/5\n`;
    content += `  Overall Tone: ${capitalizeFirst(dream.overallTone)}\n\n`;
    
    if (dream.characters.length > 0) {
      content += `CHARACTERS:\n`;
      dream.characters.forEach((char) => {
        content += `  • ${char}\n`;
      });
      content += '\n';
    }
    
    if (dream.tags.length > 0) {
      content += `TAGS: ${dream.tags.join(', ')}\n\n`;
    }
    
    content += `Created: ${formatDate(new Date(dream.createdAt), 'full')}\n`;
    content += `Last Updated: ${formatDate(new Date(dream.updatedAt), 'full')}\n`;
  });

  content += `\n${'='.repeat(80)}\n`;
  content += 'End of Dream Journal\n';
  content += `${'='.repeat(80)}\n`;

  const file = new File(fileUri);
  await file.write(content);

  return { uri: fileUri, fileName };
};

/**
 * Export dreams to JSON format
 */
const exportToJson = async (dreams: Dream[], fileUri: string, fileName: string): Promise<ExportResult> => {
  const exportData = {
    exportDate: new Date().toISOString(),
    appVersion: '1.0.0',
    totalDreams: dreams.length,
    dreams: dreams.sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    ),
  };

  const content = JSON.stringify(exportData, null, 2);

  const file = new File(fileUri);
  await file.write(content);

  return { uri: fileUri, fileName };
};

/**
 * Export dreams to PDF format
 */
const exportToPdf = async (dreams: Dream[], fileName: string): Promise<ExportResult> => {
  const sortedDreams = [...dreams].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #6366f1;
      font-size: 32px;
      margin: 0 0 10px 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .dream {
      page-break-inside: avoid;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
      background: #f9fafb;
    }
    .dream-header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .dream-number {
      color: #6366f1;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .dream-title {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
      margin: 5px 0;
    }
    .dream-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 13px;
      color: #666;
      margin-bottom: 15px;
    }
    .meta-item {
      display: inline-block;
    }
    .meta-label {
      font-weight: 600;
      color: #1a1a1a;
    }
    .section {
      margin: 15px 0;
    }
    .section-title {
      font-weight: 600;
      color: #6366f1;
      font-size: 14px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .description {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border-left: 3px solid #6366f1;
    }
    .metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .metric {
      background: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tag {
      background: #6366f1;
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
    }
    .characters li {
      margin: 5px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌙 NOCTIS DREAM JOURNAL</h1>
    <p><strong>Exported:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Total Dreams:</strong> ${dreams.length}</p>
  </div>
`;

  sortedDreams.forEach((dream, index) => {
    html += `
  <div class="dream">
    <div class="dream-header">
      <div class="dream-number">Dream #${sortedDreams.length - index}</div>
      <div class="dream-title">${escapeHtml(dream.location)}</div>
    </div>
    
    <div class="dream-meta">
      <span class="meta-item"><span class="meta-label">Date:</span> ${formatDate(new Date(dream.dateTime), 'short')}</span>
      <span class="meta-item"><span class="meta-label">Type:</span> ${capitalizeFirst(dream.type)}</span>
      <span class="meta-item"><span class="meta-label">Tone:</span> ${capitalizeFirst(dream.overallTone)}</span>
    </div>
    
    <div class="section">
      <div class="section-title">Description</div>
      <div class="description">${escapeHtml(dream.description).replace(/\n/g, '<br>')}</div>
    </div>
    
    ${dream.personalMeaning ? `
    <div class="section">
      <div class="section-title">Personal Meaning</div>
      <div class="description">${escapeHtml(dream.personalMeaning).replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}
    
    <div class="section">
      <div class="section-title">Emotional State</div>
      <div class="metrics">
        <div class="metric">Before: ${capitalizeFirst(dream.emotionalStateBefore)}</div>
        <div class="metric">After: ${capitalizeFirst(dream.emotionalStateAfter)}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Metrics</div>
      <div class="metrics">
        <div class="metric">Sleep Quality: ${dream.sleepQuality}/5</div>
        <div class="metric">Clarity: ${dream.clarity}/5</div>
        <div class="metric">Intensity: ${dream.emotionalIntensity}/5</div>
      </div>
    </div>
    
    ${dream.characters.length > 0 ? `
    <div class="section">
      <div class="section-title">Characters</div>
      <ul class="characters">
        ${dream.characters.map(char => `<li>${escapeHtml(char)}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    ${dream.tags.length > 0 ? `
    <div class="section">
      <div class="section-title">Tags</div>
      <div class="tags">
        ${dream.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </div>
    ` : ''}
  </div>
`;
  });

  html += `
  <div class="footer">
    <p>Generated by Noctis Dream Journal</p>
    <p>Keep dreaming 🌙</p>
  </div>
</body>
</html>
`;

  const { uri } = await Print.printToFileAsync({ html });
  
  return { uri, fileName };
};

/**
 * Export dreams to CSV format
 */
const exportToCsv = async (dreams: Dream[], fileUri: string, fileName: string): Promise<ExportResult> => {
  const sortedDreams = [...dreams].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  // CSV Headers
  const headers = [
    'ID',
    'Date/Time',
    'Type',
    'Location',
    'Description',
    'Personal Meaning',
    'Emotional State Before',
    'Emotional State After',
    'Sleep Quality',
    'Clarity',
    'Emotional Intensity',
    'Overall Tone',
    'Characters',
    'Tags',
    'Created At',
    'Updated At',
  ];

  let csv = headers.map(h => `"${h}"`).join(',') + '\n';

  sortedDreams.forEach((dream) => {
    const row = [
      dream.id,
      dream.dateTime,
      dream.type,
      dream.location,
      dream.description.replace(/"/g, '""'), // Escape quotes
      dream.personalMeaning.replace(/"/g, '""'),
      dream.emotionalStateBefore,
      dream.emotionalStateAfter,
      dream.sleepQuality.toString(),
      dream.clarity.toString(),
      dream.emotionalIntensity.toString(),
      dream.overallTone,
      dream.characters.join('; '),
      dream.tags.join('; '),
      dream.createdAt,
      dream.updatedAt,
    ];

    csv += row.map(field => `"${field}"`).join(',') + '\n';
  });

  const file = new File(fileUri);
  await file.write(csv);

  return { uri: fileUri, fileName };
};

/**
 * Helper function to capitalize first letter
 */
const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Helper function to escape HTML
 */
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

