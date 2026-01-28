import * as React from 'react';
import { Theme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';

function DemoContainer({
  theme,
  children,
  href,
}: {
  theme: Theme;
  children: React.ReactNode;
  href: string;
}) {
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
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'end' }}>
        <Button
          startIcon={<GitHubIcon />}
          sx={(containerTheme) => ({
            padding: '5px 12px',
            background: '#fff',
            borderRadius: '10px',
            whiteSpace: 'nowrap',
            textTransform: 'none',
            color: 'primary.main',
            fontFamily: 'IBM Plex Sans, sans-serif',
            border: '1px solid',
            letterSpacing: '0.01em',
            borderColor: 'divider',
            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            ...containerTheme.applyStyles('dark', {
              color: '#f2eff3',
              background: '#1d2329',
            }),
            '&:hover': {
              backgroundColor: '#faf8ff',
              ...containerTheme.applyStyles('dark', {
                backgroundColor: '#252d34',
              }),
            },
          })}
          href={href}
        >
          See on GitHub
        </Button>
      </Stack>
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
