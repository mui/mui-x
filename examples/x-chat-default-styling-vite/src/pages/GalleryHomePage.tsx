import * as React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { ComponentThumbCard } from '../components/ComponentThumbCard';
import { gallerySections } from '../galleryRegistry';

export function GalleryHomePage() {
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('section');

  React.useEffect(() => {
    if (!sectionId) {
      return;
    }
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [sectionId]);

  return (
    <Stack spacing={{ xs: 5, md: 7 }}>
      <Stack spacing={1.5}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
          Component gallery
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 750, maxWidth: 820 }}>
          Every @mui/x-chat component, with default Material UI styling.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
          Browse the full surface, then drill into any slot, state, or presentational helper. Click
          any card to open its dedicated playground — interactive props, code snippets, and
          slot/class metadata for that single component.
        </Typography>
      </Stack>
      {gallerySections.map((section) => (
        <Box key={section.id} component="section" id={section.id} sx={{ scrollMarginTop: 96 }}>
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
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  sm: 'repeat(3, minmax(0, 1fr))',
                  md: 'repeat(4, minmax(0, 1fr))',
                  lg: 'repeat(5, minmax(0, 1fr))',
                },
                gap: { xs: 1.25, md: 1.5 },
              }}
            >
              {section.entries.map((entry) => (
                <ComponentThumbCard key={entry.id} entry={entry} />
              ))}
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
