'use client';
import * as React from 'react';
import { createTheme, ThemeProvider, type Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

type BrandPreset = {
  id: string;
  label: string;
  theme: Theme;
  variant: 'default' | 'compact';
  density: 'compact' | 'comfortable';
  sx?: React.CSSProperties | Record<string, unknown>;
};

const slackTheme = createTheme({
  palette: {
    primary: { main: '#611f69' },
    background: { default: '#ffffff', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Lato", "Helvetica Neue", sans-serif' },
  shape: { borderRadius: 4 },
});

const whatsAppTheme = createTheme({
  palette: {
    primary: { main: '#25d366' },
    background: { default: '#efeae2', paper: '#ffffff' },
  },
  shape: { borderRadius: 8 },
});

const telegramTheme = createTheme({
  palette: { primary: { main: '#0088cc' } },
  shape: { borderRadius: 18 },
});

const chatGptTheme = createTheme({
  palette: {
    primary: { main: '#10a37f' },
    background: { default: '#ffffff', paper: '#f7f7f8' },
  },
  typography: {
    fontFamily: '"Söhne", "Helvetica Neue", sans-serif',
    body2: { fontSize: '1rem', lineHeight: 1.75 },
  },
  shape: { borderRadius: 16 },
});

const anthropicTheme = createTheme({
  palette: {
    primary: { main: '#da7756' },
    background: { default: '#faf9f5', paper: '#faf9f5' },
  },
  typography: {
    fontFamily: '"Styrene A", "Helvetica Neue", sans-serif',
    body2: { fontSize: '1rem', lineHeight: 1.7 },
  },
  shape: { borderRadius: 24 },
});

const v0Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    background: { default: '#0a0a0a', paper: '#171717' },
    text: { primary: '#ededed', secondary: '#a1a1a1' },
  },
  typography: { fontFamily: '"Geist", "Inter", system-ui, sans-serif' },
  shape: { borderRadius: 12 },
});

const PRESETS: BrandPreset[] = [
  {
    id: 'slack',
    label: 'Slack',
    theme: slackTheme,
    variant: 'compact',
    density: 'comfortable',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    theme: whatsAppTheme,
    variant: 'default',
    density: 'compact',
    sx: { backgroundColor: '#efeae2' },
  },
  {
    id: 'telegram',
    label: 'Telegram',
    theme: telegramTheme,
    variant: 'default',
    density: 'comfortable',
    sx: { background: 'linear-gradient(135deg, #c8d6e5 0%, #8e9eab 100%)' },
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    theme: chatGptTheme,
    variant: 'compact',
    density: 'comfortable',
  },
  {
    id: 'claude',
    label: 'Claude',
    theme: anthropicTheme,
    variant: 'compact',
    density: 'comfortable',
  },
  {
    id: 'v0',
    label: 'v0.dev',
    theme: v0Theme,
    variant: 'compact',
    density: 'comfortable',
  },
];

const adapter = createEchoAdapter({
  respond: (text) =>
    `You said: "${text}". Every bubble color, radius, and font here comes from the active theme — switch tabs to see the same chat restyled.`,
});

export default function BrandThemes() {
  const [activeId, setActiveId] = React.useState<string>(PRESETS[0].id);
  const active = PRESETS.find((p) => p.id === activeId) ?? PRESETS[0];

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeId}
        onChange={(_, value) => setActiveId(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        {PRESETS.map((preset) => (
          <Tab key={preset.id} value={preset.id} label={preset.label} />
        ))}
      </Tabs>
      <ThemeProvider theme={active.theme}>
        <CssBaseline />
        <ChatBox
          adapter={adapter}
          initialActiveConversationId={minimalConversation.id}
          initialConversations={[minimalConversation]}
          initialMessages={minimalMessages}
          variant={active.variant}
          density={active.density}
          sx={{
            height: 500,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            ...(active.sx as object),
          }}
        />
      </ThemeProvider>
    </Box>
  );
}
