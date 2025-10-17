import * as React from 'react';
import { Theme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import MultiFileCodeViewer from './MultiFileCodeViewer';
import type { DemoSourceFiles, SourceFileDisplayConfig } from './types/sourceFiles';

interface DemoContainerProps {
  theme: Theme;
  children: React.ReactNode;
  sourceFiles?: Record<string, string>;
  demoSourceFiles?: DemoSourceFiles;
  sourceDisplayConfig?: Partial<SourceFileDisplayConfig>;
  defaultFile?: string;
}

function DemoContainer({
  theme,
  children,
  sourceFiles,
  demoSourceFiles,
  sourceDisplayConfig,
  defaultFile,
}: DemoContainerProps) {
  const docsTheme = useTheme();
  const docsMode = docsTheme?.palette?.mode;
  const [showCode, setShowCode] = React.useState(false);

  const modifiedTheme = React.useMemo(() => {
    if (docsMode) {
      Object.assign(theme, theme.colorSchemes[docsMode]);
    }
    return theme;
  }, [docsMode, theme]);

  return (
    <ThemeProvider theme={modifiedTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            height: { xs: 'calc(100vh - 300px)', md: 'calc(100vh - 250px)' }, // TODO: Find a way to fill height without magic number,
          }}
        >
          {children}
        </Box>

        {(sourceFiles || demoSourceFiles) && (
          <Paper
            component="div"
            elevation={0}
            sx={{
              width: '100%',
              marginTop: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 0,
              backgroundColor: 'background.paper',
              display: 'flex',
              padding: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Button
              size="small"
              variant="outlined"
              sx={{ color: 'primary.main', px: 1, boxShadow: 'none' }}
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? 'Hide' : 'Show'} code
            </Button>
            {/* TODO:Add stackblitz/GitHub buttons too?? */}
          </Paper>
        )}

        {(sourceFiles || demoSourceFiles) && (
          <Collapse in={showCode}>
            <MultiFileCodeViewer
              files={sourceFiles}
              sourceFiles={demoSourceFiles}
              displayConfig={sourceDisplayConfig}
              defaultFile={defaultFile}
            />
          </Collapse>
        )}
      </Box>
    </ThemeProvider>
  );
}

export { DemoContainer };
