'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';

import {
  ChoiceControl,
  NumberControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

// Enough height to show the conversation list, header, and a few messages at once.
const PREVIEW_HEIGHT = 540;
// `shape.borderRadius` stays in a range that reads on chat bubbles without turning them into pills.
const MAX_BORDER_RADIUS = 28;

const PRIMARY_PRESETS = [
  { label: 'Indigo', value: '#5b6cff' },
  { label: 'Slack', value: '#611f69' },
  { label: 'WhatsApp', value: '#25d366' },
  { label: 'Telegram', value: '#0088cc' },
  { label: 'Claude', value: '#da7756' },
];

const allConversations = [minimalConversation, ...inboxConversations];
const allMessages = [...minimalMessages, ...Object.values(inboxThreads).flat()];

const adapter = createEchoAdapter({
  respond: (text) =>
    `Echo: "${text}". Every bubble color, radius, and density above is driven by the props on the right.`,
});

export default function LookAndFeelPlayground() {
  const [variant, setVariant] = React.useState('default');
  const [density, setDensity] = React.useState('standard');
  const [primary, setPrimary] = React.useState(PRIMARY_PRESETS[0].value);
  const [radius, setRadius] = React.useState(12);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { primary: { main: primary } },
        shape: { borderRadius: radius },
      }),
    [primary, radius],
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 240px' },
        width: '100%',
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Paper
          variant="outlined"
          sx={{
            height: PREVIEW_HEIGHT,
            overflow: 'hidden',
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <ChatBox
            adapter={adapter}
            currentUser={inboxConversations[0].participants?.[0]}
            initialConversations={allConversations}
            initialMessages={allMessages}
            initialActiveConversationId={minimalConversation.id}
            variant={variant}
            density={density}
            features={{
              conversationList: true,
              conversationHeader: true,
              attachments: true,
              autoScroll: true,
            }}
            sx={{ height: '100%' }}
          />
        </Paper>
      </ThemeProvider>

      <Stack spacing={1.5} sx={{ alignSelf: 'flex-start' }}>
        <Typography variant="caption" color="text.secondary">
          Every change re-themes the live chat on the left.
        </Typography>

        <ChoiceControl
          label="variant"
          value={variant}
          options={['default', 'compact']}
          onChange={setVariant}
        />
        <ChoiceControl
          label="density"
          value={density}
          options={['compact', 'standard', 'comfortable']}
          onChange={setDensity}
        />
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            palette.primary.main
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={primary}
            onChange={(_, next) => {
              if (next !== null) {
                setPrimary(next);
              }
            }}
            aria-label="palette.primary.main"
            sx={{ flexWrap: 'wrap', gap: 0.5, border: 0 }}
          >
            {PRIMARY_PRESETS.map((preset) => (
              <ToggleButton
                key={preset.value}
                value={preset.value}
                aria-label={preset.label}
                title={preset.label}
                sx={{
                  width: 28,
                  height: 28,
                  p: 0,
                  borderRadius: '50% !important',
                  border: '2px solid transparent',
                  backgroundColor: preset.value,
                  '&.Mui-selected': {
                    borderColor: 'text.primary',
                    backgroundColor: preset.value,
                  },
                  '&:hover, &.Mui-selected:hover': { backgroundColor: preset.value },
                }}
              />
            ))}
          </ToggleButtonGroup>
        </Stack>

        <NumberControl
          label="shape.borderRadius"
          value={radius}
          min={0}
          max={MAX_BORDER_RADIUS}
          valueFormatter={(value) => `${value}px`}
          onChange={setRadius}
        />
      </Stack>
    </Box>
  );
}
