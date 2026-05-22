import * as React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import type { ChatBoxLayoutMode, ChatDensity, ChatVariant } from '@mui/x-chat';
import type { ThemeFlavor, ThemeMode } from '../theme';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79L19 20.49 20.49 19zM10 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  );
}

interface GalleryToolbarProps {
  mode: ThemeMode;
  flavor: ThemeFlavor;
  variant: ChatVariant;
  density: ChatDensity;
  layoutMode: ChatBoxLayoutMode | 'auto';
  onModeChange: (mode: ThemeMode) => void;
  onFlavorChange: (flavor: ThemeFlavor) => void;
  onVariantChange: (variant: ChatVariant) => void;
  onDensityChange: (density: ChatDensity) => void;
  onLayoutModeChange: (layoutMode: ChatBoxLayoutMode | 'auto') => void;
  onSearchOpen: () => void;
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

export function GalleryToolbar({
  mode,
  flavor,
  variant,
  density,
  layoutMode,
  onModeChange,
  onFlavorChange,
  onVariantChange,
  onDensityChange,
  onLayoutModeChange,
  onSearchOpen,
}: GalleryToolbarProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
        gap: { xs: 2, md: 3 },
        alignItems: 'end',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          flexWrap: 'wrap',
          rowGap: 1.5,
          alignItems: 'flex-end',
        }}
      >
        <ControlGroup label="variant">
          <ButtonGroup size="small" variant="outlined" aria-label="Chat variant">
            {(['default', 'compact'] as const).map((item) => (
              <Button
                key={item}
                variant={variant === item ? 'contained' : 'outlined'}
                onClick={() => onVariantChange(item)}
              >
                {item}
              </Button>
            ))}
          </ButtonGroup>
        </ControlGroup>
        <ControlGroup label="density">
          <ButtonGroup size="small" variant="outlined" aria-label="Chat density">
            {(['compact', 'standard', 'comfortable'] as const).map((item) => (
              <Button
                key={item}
                variant={density === item ? 'contained' : 'outlined'}
                onClick={() => onDensityChange(item)}
              >
                {item}
              </Button>
            ))}
          </ButtonGroup>
        </ControlGroup>
        <ControlGroup label="layoutMode">
          <ButtonGroup size="small" variant="outlined" aria-label="Layout mode">
            {(['auto', 'standard', 'split', 'overlay'] as const).map((item) => (
              <Button
                key={item}
                variant={layoutMode === item ? 'contained' : 'outlined'}
                onClick={() => onLayoutModeChange(item)}
              >
                {item}
              </Button>
            ))}
          </ButtonGroup>
        </ControlGroup>
      </Stack>
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          flexWrap: 'wrap',
          rowGap: 1,
          justifyContent: { md: 'flex-end' },
          alignItems: 'center',
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={onSearchOpen}
          startIcon={<SearchIcon />}
          sx={{ minHeight: 34, textTransform: 'none' }}
        >
          Search
          <Box
            component="span"
            sx={{
              ml: 1,
              px: 0.75,
              py: 0.25,
              borderRadius: 0.5,
              bgcolor: 'action.hover',
              fontSize: '0.7rem',
              fontFamily: 'monospace',
            }}
          >
            ⌘K
          </Box>
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={(_, checked) => onModeChange(checked ? 'dark' : 'light')}
            />
          }
          label="Dark"
          sx={{ mr: 0 }}
        />
        <ButtonGroup size="small" variant="outlined" aria-label="Theme flavor">
          <Button
            variant={flavor === 'plain' ? 'contained' : 'outlined'}
            onClick={() => onFlavorChange('plain')}
          >
            Plain
          </Button>
          <Button
            variant={flavor === 'material' ? 'contained' : 'outlined'}
            onClick={() => onFlavorChange('material')}
          >
            Material
          </Button>
        </ButtonGroup>
        <Chip size="small" color="primary" variant="outlined" label={`mode: ${mode}`} />
        <Chip size="small" variant="outlined" label={`flavor: ${flavor}`} />
      </Stack>
    </Box>
  );
}
