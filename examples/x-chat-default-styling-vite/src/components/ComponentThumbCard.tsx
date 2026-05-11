import * as React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { GalleryComponentEntry } from '../galleryRegistry';

const statusLabels: Record<GalleryComponentEntry['status'], string> = {
  core: 'Core',
  compound: 'Compound',
  slot: 'Slot',
  state: 'State',
  presentational: 'Presentational',
};

interface ComponentThumbCardProps {
  entry: GalleryComponentEntry;
}

export function ComponentThumbCard({ entry }: ComponentThumbCardProps) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/component/${entry.id}`);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };
  const Thumbnail = entry.Thumbnail;

  return (
    <Paper
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        color: 'inherit',
        borderRadius: 1.5,
        overflow: 'hidden',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 2,
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          aspectRatio: '4 / 3',
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& > svg': { width: '100%', height: '100%', display: 'block' },
        }}
      >
        {Thumbnail && <Thumbnail />}
      </Box>
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ alignItems: 'center', justifyContent: 'space-between', px: 1.25, py: 0.75 }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
        >
          {entry.title}
        </Typography>
        <Chip
          size="small"
          variant="outlined"
          label={statusLabels[entry.status]}
          sx={{
            height: 18,
            fontSize: '0.625rem',
            fontWeight: 600,
            flexShrink: 0,
            '& .MuiChip-label': { px: 0.75 },
          }}
        />
      </Stack>
    </Paper>
  );
}
