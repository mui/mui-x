import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { BrandingProvider } from '@mui/docs/branding';

interface MultiFileCodeViewerProps {
  files: Record<string, string>;
  defaultFile?: string;
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'tsx';
    case 'js':
    case 'jsx':
      return 'jsx';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    default:
      return 'tsx';
  }
}

export default function MultiFileCodeViewer({ files, defaultFile }: MultiFileCodeViewerProps) {
  const [selectedFile, setSelectedFile] = React.useState(defaultFile || Object.keys(files)[0]);

  return (
    <div>
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
        {Object.keys(files).map((filename) => (
          <Tab key={filename} label={filename.split('/').pop()} value={filename} title={filename} />
        ))}
      </Tabs>

      <BrandingProvider mode="dark">
        <HighlightedCode
          code={files[selectedFile] || ''}
          language={getLanguageFromFilename(selectedFile)}
          sx={{ maxHeight: 500, overflow: 'auto' }}
        />
      </BrandingProvider>
    </div>
  );
}
