import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { BrandingProvider } from '@mui/docs/branding';
import type { DemoSourceFiles, SourceFileDisplayConfig, FileCategory } from './types/sourceFiles';
import { DEFAULT_DISPLAY_CONFIG, CATEGORY_INFO } from './types/sourceFiles';

interface MultiFileCodeViewerProps {
  files?: Record<string, string>;
  sourceFiles?: DemoSourceFiles;
  displayConfig?: Partial<SourceFileDisplayConfig>;
  defaultFile?: string;
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext === 'ts' ? 'ts' : 'tsx';
}

export default function MultiFileCodeViewer({
  files,
  sourceFiles,
  displayConfig,
  defaultFile,
}: MultiFileCodeViewerProps) {
  const config = { ...DEFAULT_DISPLAY_CONFIG, ...displayConfig };

  const normalizedFiles = React.useMemo(() => {
    if (sourceFiles) {
      return sourceFiles;
    }
    if (files) {
      return Object.entries(files).reduce((acc, [filename, content]) => {
        acc[filename] = {
          content,
          category: 'main' as FileCategory,
        };
        return acc;
      }, {} as DemoSourceFiles);
    }
    return {};
  }, [files, sourceFiles]);

  const filesByCategory = React.useMemo(() => {
    const grouped: Record<FileCategory, Array<{ filename: string; config: any }>> = {
      main: [],
      components: [],
      hooks: [],
      utils: [],
      data: [],
      types: [],
      styles: [],
      context: [],
    };

    Object.entries(normalizedFiles).forEach(([filename, fileConfig]) => {
      grouped[fileConfig.category].push({ filename, config: fileConfig });
    });

    Object.keys(grouped).forEach((category) => {
      grouped[category as FileCategory].sort(
        (a, b) => (a.config.priority || 0) - (b.config.priority || 0),
      );
    });

    return grouped;
  }, [normalizedFiles]);

  const availableCategories = React.useMemo(() => {
    return config.categoryOrder!.filter((category) => filesByCategory[category].length > 0);
  }, [filesByCategory, config.categoryOrder]);

  const [selectedCategory, setSelectedCategory] = React.useState<FileCategory>(
    config.defaultCategory && availableCategories.includes(config.defaultCategory)
      ? config.defaultCategory
      : availableCategories[0],
  );

  const [selectedFile, setSelectedFile] = React.useState(() => {
    if (defaultFile && normalizedFiles[defaultFile]) {
      return defaultFile;
    }
    const categoryFiles = filesByCategory[selectedCategory];
    return categoryFiles.length > 0 ? categoryFiles[0].filename : Object.keys(normalizedFiles)[0];
  });

  React.useEffect(() => {
    const categoryFiles = filesByCategory[selectedCategory];
    if (categoryFiles.length > 0 && !categoryFiles.some((f) => f.filename === selectedFile)) {
      setSelectedFile(categoryFiles[0].filename);
    }
  }, [selectedCategory, filesByCategory, selectedFile]);

  const currentFileConfig = normalizedFiles[selectedFile];
  const currentCode = currentFileConfig?.content || '';

  if (Object.keys(normalizedFiles).length === 0) {
    return null;
  }

  return (
    <div>
      {config.showCategories && availableCategories.length > 1 && (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 1 }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, value) => setSelectedCategory(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                minHeight: 36,
                fontSize: '0.75rem',
                textTransform: 'none',
                minWidth: 80,
                py: 0.5,
              },
            }}
          >
            {availableCategories.map((category) => (
              <Tab key={category} value={category} label={CATEGORY_INFO[category].label} />
            ))}
          </Tabs>
        </Box>
      )}

      <Tabs
        value={selectedFile}
        onChange={(_, value) => setSelectedFile(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
            fontSize: '0.875rem',
            textTransform: 'none',
            minWidth: 120,
          },
        }}
      >
        {filesByCategory[selectedCategory].map(({ filename }) => (
          <Tab key={filename} label={filename.split('/').pop()} value={filename} title={filename} />
        ))}
      </Tabs>

      <BrandingProvider mode="dark">
        <Box sx={{ position: 'relative' }}>
          <HighlightedCode
            code={currentCode}
            language={getLanguageFromFilename(selectedFile)}
            sx={{
              maxHeight: 500,
              overflow: 'auto',
            }}
          />
        </Box>
      </BrandingProvider>
    </div>
  );
}
