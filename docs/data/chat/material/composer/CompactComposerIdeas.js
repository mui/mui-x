'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

// Idea 1: Top separator only
// Clean divider — no side/bottom borders, no background, no radius.
// Focus thickens the top border and colors it primary.
const theme1 = (base) =>
  createTheme(base, {
    components: {
      MuiChatComposer: {
        styleOverrides: {
          root: {
            '&.MuiChatComposer-variantCompact': {
              margin: 0,
              border: 'none',
              borderTop: '1px solid',
              borderColor: base.palette.divider,
              borderRadius: 0,
              backgroundColor: 'transparent',
              transition: base.transitions.create(['border-color'], {
                duration: base.transitions.duration.short,
              }),
              '&:focus-within:not([data-disabled])': {
                borderColor: base.palette.primary.main,
                borderTopWidth: 2,
                boxShadow: 'none',
              },
            },
          },
        },
      },
    },
  });

// Idea 2: Floating pill
// Margin + large borderRadius for a pill/capsule shape. Focus adds a primary ring.
const theme2 = (base) =>
  createTheme(base, {
    components: {
      MuiChatComposer: {
        styleOverrides: {
          root: {
            '&.MuiChatComposer-variantCompact': {
              margin: base.spacing(0.5, 1.5, 1.5),
              border: '1px solid',
              borderColor: base.palette.divider,
              borderRadius: 99,
              backgroundColor: base.palette.action.hover,
              '&:focus-within:not([data-disabled])': {
                borderColor: base.palette.primary.main,
                boxShadow: `0 0 0 1px ${base.palette.primary.main}`,
              },
            },
          },
        },
      },
    },
  });

// Idea 3: Elevated card
// Margin, normal radius, no border — uses elevation shadow instead.
// Focus deepens the shadow with a primary tint.
const theme3 = (base) =>
  createTheme(base, {
    components: {
      MuiChatComposer: {
        styleOverrides: {
          root: {
            '&.MuiChatComposer-variantCompact': {
              margin: base.spacing(0.5, 1, 1),
              border: 'none',
              borderRadius: base.shape.borderRadius,
              backgroundColor: base.palette.background.paper,
              boxShadow: base.shadows[2],
              transition: base.transitions.create(['box-shadow'], {
                duration: base.transitions.duration.short,
              }),
              '&:focus-within:not([data-disabled])': {
                boxShadow: `${base.shadows[4]}, 0 0 0 2px ${alpha(base.palette.primary.main, 0.25)}`,
              },
            },
          },
        },
      },
    },
  });

// Idea 4: Borderless minimal
// No border, no margin, transparent bg. Just a faint top separator.
// Focus adds a subtle background tint. Ultra-clean.
const theme4 = (base) =>
  createTheme(base, {
    components: {
      MuiChatComposer: {
        styleOverrides: {
          root: {
            '&.MuiChatComposer-variantCompact': {
              margin: 0,
              border: 'none',
              borderTop: '1px solid',
              borderColor: base.palette.divider,
              borderRadius: 0,
              backgroundColor: 'transparent',
              transition: base.transitions.create(['background-color'], {
                duration: base.transitions.duration.short,
              }),
              '&:focus-within:not([data-disabled])': {
                backgroundColor: base.palette.action.hover,
                boxShadow: 'none',
              },
            },
          },
        },
      },
    },
  });

// Idea 5: Inset outlined
// Margin all around, full border, normal borderRadius — same treatment as default variant.
// Focus: primary border + ring. The "classic" text field look.
const theme5 = (base) =>
  createTheme(base, {
    components: {
      MuiChatComposer: {
        styleOverrides: {
          root: {
            '&.MuiChatComposer-variantCompact': {
              margin: base.spacing(0.5, 1, 1),
              border: '1px solid',
              borderColor: base.palette.divider,
              borderRadius: base.shape.borderRadius,
              backgroundColor: base.palette.action.hover,
              '&:focus-within:not([data-disabled])': {
                borderColor: base.palette.primary.main,
                boxShadow: `0 0 0 1px ${base.palette.primary.main}`,
              },
            },
          },
        },
      },
    },
  });

const ideas = [
  {
    label: '1 — Top separator',
    description: 'Only a top border divider. Focus colors it primary.',
    createTheme: theme1,
  },
  {
    label: '2 — Floating pill',
    description: 'Margin + pill-shaped radius. Focus adds primary ring.',
    createTheme: theme2,
  },
  {
    label: '3 — Elevated card',
    description: 'No border, elevation shadow. Focus deepens shadow.',
    createTheme: theme3,
  },
  {
    label: '4 — Borderless minimal',
    description: 'Top separator, transparent bg. Focus tints background.',
    createTheme: theme4,
  },
  {
    label: '5 — Inset outlined',
    description: 'Margin + border + radius like default variant.',
    createTheme: theme5,
  },
];

function CompactIdea({ idea }) {
  const baseTheme = createTheme();
  const theme = idea.createTheme(baseTheme);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {idea.label}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {idea.description}
      </Typography>
      <ThemeProvider theme={theme}>
        <ChatBox
          variant="compact"
          adapter={adapter}
          initialActiveConversationId={minimalConversation.id}
          initialConversations={[minimalConversation]}
          initialMessages={minimalMessages}
          features={{ conversationList: false }}
          sx={{
            height: 300,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </ThemeProvider>
    </Box>
  );
}

const adapter = createEchoAdapter();

export default function CompactComposerIdeas() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {ideas.map((idea) => (
        <CompactIdea key={idea.label} idea={idea} />
      ))}
    </Box>
  );
}
