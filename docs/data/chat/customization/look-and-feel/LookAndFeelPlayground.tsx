'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import type { ChatDensity, ChatVariant } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const PRIMARY_PRESETS: Array<{ label: string; value: string }> = [
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
  const [variant, setVariant] = React.useState<ChatVariant>('default');
  const [density, setDensity] = React.useState<ChatDensity>('standard');
  const [primary, setPrimary] = React.useState<string>(PRIMARY_PRESETS[0].value);
  const [radius, setRadius] = React.useState<number>(12);

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
            height: 540,
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

      <Stack
        spacing={2}
        sx={{
          p: 2,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          alignSelf: 'flex-start',
        }}
      >
        <Stack spacing={0.25}>
          <Typography variant="overline" color="text.secondary">
            Props
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Every change re-themes the live chat on the left.
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            variant
          </Typography>
          <ButtonGroup size="small" variant="outlined" fullWidth>
            {(['default', 'compact'] as const).map((value) => (
              <Button
                key={value}
                variant={variant === value ? 'contained' : 'outlined'}
                onClick={() => setVariant(value)}
              >
                {value}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            density
          </Typography>
          <ButtonGroup size="small" variant="outlined" fullWidth>
            {(['compact', 'standard', 'comfortable'] as const).map((value) => (
              <Button
                key={value}
                variant={density === value ? 'contained' : 'outlined'}
                onClick={() => setDensity(value)}
              >
                {value}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>

        <Divider flexItem />

        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            palette.primary.main
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {PRIMARY_PRESETS.map((preset) => (
              <Box
                key={preset.value}
                component="button"
                aria-label={preset.label}
                title={preset.label}
                onClick={() => setPrimary(preset.value)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: primary === preset.value ? 'text.primary' : 'transparent',
                  backgroundColor: preset.value,
                  cursor: 'pointer',
                  padding: 0,
                  outline: 'none',
                  transition: 'transform 120ms',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              />
            ))}
          </Stack>
        </Stack>

        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="caption" color="text.secondary">
              shape.borderRadius
            </Typography>
            <Typography
              variant="caption"
              color="text.primary"
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {radius}px
            </Typography>
          </Box>
          <Slider
            size="small"
            value={radius}
            min={0}
            max={28}
            step={1}
            onChange={(_, next) => setRadius(typeof next === 'number' ? next : next[0])}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
