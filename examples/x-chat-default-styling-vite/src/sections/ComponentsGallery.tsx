import * as React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  gallerySections as registrySections,
  type GalleryComponentEntry,
  type GallerySection,
} from '../galleryRegistry';

export interface GallerySectionInfo {
  id: string;
  title: string;
  count: number;
  entries?: Array<{
    id: string;
    title: string;
    status: GalleryComponentEntry['status'];
  }>;
}

export const gallerySections: GallerySectionInfo[] = registrySections.map((section) => ({
  id: section.id,
  title: section.title,
  count: section.entries.length,
  entries: section.entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    status: entry.status,
  })),
}));

const statusLabels: Record<GalleryComponentEntry['status'], string> = {
  core: 'Core',
  compound: 'Compound',
  slot: 'Slot',
  state: 'State',
  presentational: 'Presentational',
};

function Section({ section }: { section: GallerySection }) {
  return (
    <Box
      component="section"
      id={section.id}
      sx={{
        scrollMarginTop: '96px',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: { xs: 4, md: 5 },
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { sm: 'flex-end' },
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={0.75} sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {section.title}
              </Typography>
              <Chip
                size="small"
                label={`${section.entries.length} component${
                  section.entries.length !== 1 ? 's' : ''
                }`}
                sx={{ height: 24, bgcolor: 'action.hover', fontWeight: 600 }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {section.description}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ flexWrap: 'wrap', justifyContent: { sm: 'flex-end' }, rowGap: 0.75 }}
          >
            {Array.from(new Set(section.entries.map((entry) => entry.status))).map((status) => (
              <Chip key={status} size="small" variant="outlined" label={statusLabels[status]} />
            ))}
          </Stack>
        </Stack>
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          {section.entries.map((entry) => (
            <Box
              key={entry.id}
              id={entry.id}
              data-gallery-entry={entry.title}
              sx={{
                minWidth: 0,
                scrollMarginTop: '96px',
                display: 'flex',
                '& > .MuiPaper-root': {
                  width: '100%',
                },
              }}
            >
              {entry.playground}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default function ComponentsGallery() {
  return (
    <Stack spacing={{ xs: 5, md: 6 }}>
      {registrySections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </Stack>
  );
}
