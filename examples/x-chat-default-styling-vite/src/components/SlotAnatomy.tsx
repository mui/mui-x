import * as React from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { galleryEntries, type GalleryComponentEntry } from '../galleryRegistry';

const anatomyGroups = [
  {
    title: 'Surface',
    ids: ['chat-box', 'chat-conversation', 'chat-conversation-list'],
  },
  {
    title: 'Header',
    ids: [
      'chat-conversation-header',
      'chat-conversation-header-info',
      'chat-conversation-title',
      'chat-conversation-subtitle',
      'chat-conversation-header-actions',
    ],
  },
  {
    title: 'Messages',
    ids: [
      'chat-message-list',
      'chat-message-group',
      'chat-message',
      'chat-message-avatar',
      'chat-message-content',
      'chat-message-meta',
      'chat-message-actions',
    ],
  },
  {
    title: 'Composer',
    ids: [
      'chat-composer',
      'chat-composer-text-area',
      'chat-composer-toolbar',
      'chat-composer-attach-button',
      'chat-composer-send-button',
      'chat-composer-attachment-list',
      'chat-composer-helper-text',
    ],
  },
  {
    title: 'States',
    ids: [
      'chat-suggestions',
      'chat-typing-indicator',
      'chat-unread-marker',
      'chat-scroll-to-bottom-affordance',
      'chat-message-skeleton',
    ],
  },
  {
    title: 'Rich content',
    ids: ['chat-message-sources', 'chat-code-block', 'chat-confirmation'],
  },
];

const statusColors: Record<GalleryComponentEntry['status'], 'default' | 'primary' | 'secondary'> = {
  core: 'primary',
  compound: 'secondary',
  slot: 'default',
  state: 'default',
  presentational: 'default',
};

function findEntry(id: string) {
  return galleryEntries.find((entry) => entry.id === id);
}

function scrollToEntry(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }
  window.history.pushState(null, '', `#${id}`);
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function SlotAnatomy() {
  return (
    <Box
      id="slot-anatomy"
      component="section"
      sx={{
        scrollMarginTop: '96px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-end' } }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6">Slot anatomy</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 780 }}>
              Start with `ChatBox`, then replace or style the slots below. Each chip jumps to the
              focused playground for that component.
            </Typography>
          </Stack>
          <Button size="small" variant="outlined" onClick={() => scrollToEntry('chat-box')}>
            Open ChatBox
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, 1fr)' },
          gap: 0,
        }}
      >
        {anatomyGroups.map((group) => (
          <Box
            key={group.title}
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRight: { xl: '1px solid' },
              borderBottom: '1px solid',
              borderColor: 'divider',
              minWidth: 0,
            }}
          >
            <Stack spacing={1.25}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {group.title}
              </Typography>
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                {group.ids.map((id) => {
                  const entry = findEntry(id);
                  if (!entry) {
                    return null;
                  }
                  return (
                    <Chip
                      key={entry.id}
                      size="small"
                      clickable
                      color={statusColors[entry.status]}
                      variant={entry.status === 'core' ? 'filled' : 'outlined'}
                      label={entry.importName}
                      onClick={() => scrollToEntry(entry.id)}
                    />
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: 'action.hover' }}>
        <Typography variant="caption" color="text.secondary">
          Notes: title and subtitle slots read the active conversation from context; suggestions
          render only in empty threads; sources can be manual citation lists or message parts;
          typing and unread markers are best demonstrated in custom layouts.
        </Typography>
      </Box>
    </Box>
  );
}
