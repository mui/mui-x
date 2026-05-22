import * as React from 'react';
import { Box, Breadcrumbs, Chip, Link as MuiLink, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useParams, Navigate } from 'react-router-dom';
import { galleryEntries, gallerySections } from '../galleryRegistry';
import type { GalleryComponentEntry } from '../galleryRegistry';

const statusColors: Record<
  GalleryComponentEntry['status'],
  'primary' | 'secondary' | 'info' | 'warning' | 'success'
> = {
  core: 'primary',
  compound: 'secondary',
  slot: 'info',
  state: 'warning',
  presentational: 'success',
};

const statusLabels: Record<GalleryComponentEntry['status'], string> = {
  core: 'Core',
  compound: 'Compound',
  slot: 'Slot',
  state: 'State',
  presentational: 'Presentational',
};

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
    </svg>
  );
}

export function ComponentDetailPage() {
  const params = useParams<{ id: string }>();
  const entry = galleryEntries.find((item) => item.id === params.id);

  if (!entry) {
    return <Navigate to="/" replace />;
  }

  const section = gallerySections.find((item) => item.id === entry.sectionId);
  const siblingEntries = section ? section.entries.filter((item) => item.id !== entry.id) : [];

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Breadcrumbs separator={<ChevronRightIcon />} aria-label="breadcrumb">
          <MuiLink component={RouterLink} to="/" underline="hover" color="inherit">
            Gallery
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to={`/#${entry.sectionId}`}
            underline="hover"
            color="inherit"
          >
            {entry.sectionTitle}
          </MuiLink>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {entry.title}
          </Typography>
        </Breadcrumbs>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h3" sx={{ fontWeight: 750 }}>
              {entry.title}
            </Typography>
            <Chip
              size="small"
              color={statusColors[entry.status]}
              variant="outlined"
              label={statusLabels[entry.status]}
              sx={{ fontWeight: 600 }}
            />
            {entry.parent ? (
              <Chip size="small" variant="outlined" label={`in ${entry.parent}`} />
            ) : null}
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            {entry.description}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 1, flexWrap: 'wrap', rowGap: 1 }}>
            <MetadataInline label="import" values={[entry.importName]} mono />
            <MetadataInline label="package" values={['@mui/x-chat']} mono />
            <MetadataInline label="source" values={[entry.sourcePath]} mono />
          </Stack>
        </Stack>
      </Stack>

      <div>{entry.playground}</div>

      {siblingEntries.length > 0 ? (
        <Stack spacing={2} sx={{ pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            More in {entry.sectionTitle}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 1.5,
            }}
          >
            {siblingEntries.map((sibling) => (
              <Paper
                key={sibling.id}
                component={RouterLink}
                to={`/component/${sibling.id}`}
                variant="outlined"
                sx={{
                  p: 1.5,
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  transition: 'border-color 0.18s ease-in-out, box-shadow 0.18s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {sibling.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {sibling.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Stack>
      ) : null}
    </Stack>
  );
}

function MetadataInline({
  label,
  values,
  mono,
}: {
  label: string;
  values: ReadonlyArray<string | undefined>;
  mono?: boolean;
}) {
  const visible = values.filter((value): value is string => Boolean(value));
  if (visible.length === 0) {
    return null;
  }
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      {visible.map((value) => (
        <Typography
          key={value}
          variant="caption"
          sx={{
            fontFamily: mono ? 'monospace' : undefined,
            bgcolor: 'action.hover',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.75,
          }}
        >
          {value}
        </Typography>
      ))}
    </Stack>
  );
}
