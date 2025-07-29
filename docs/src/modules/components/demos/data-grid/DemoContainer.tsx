import * as React from 'react';
import { Theme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

function DemoContainer({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  const docsTheme = useTheme();
  const docsMode = docsTheme?.palette?.mode;

  const modifiedTheme = React.useMemo(() => {
    if (docsMode) {
      Object.assign(theme, theme.colorSchemes[docsMode]);
    }
    return theme;
  }, [docsMode, theme]);

  return (
    <ThemeProvider theme={modifiedTheme}>
      <Box
        sx={{
          height: { xs: 'calc(100vh - 300px)', md: 'calc(100vh - 250px)' }, // TODO: Find a way to fill height without magic number,
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}

export { DemoContainer };
