import * as React from 'react';
import { Theme, ThemeProvider, useTheme } from '@mui/material/styles';

function DemoThemeProvider({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  const docsTheme = useTheme();
  const docsMode = docsTheme?.palette?.mode;

  const modifiedTheme = React.useMemo(() => {
    if (docsMode) {
      Object.assign(theme, theme.colorSchemes[docsMode]);
    }
    return theme;
  }, [docsMode]);

  return <ThemeProvider theme={modifiedTheme}>{children}</ThemeProvider>;
}

export { DemoThemeProvider };
