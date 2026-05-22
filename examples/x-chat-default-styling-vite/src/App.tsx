import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Navigate, Route, Routes } from 'react-router-dom';
import { SearchDialog, useSearchDialog } from './components/SearchDialog';
import { GalleryHomePage } from './pages/GalleryHomePage';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { gallerySearchItems } from './galleryRegistry';
import type { ThemeFlavor, ThemeMode } from './theme';

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79L19 20.49 20.49 19zM10 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  );
}

interface AppProps {
  mode: ThemeMode;
  flavor: ThemeFlavor;
  onModeChange: (mode: ThemeMode) => void;
  onFlavorChange: (flavor: ThemeFlavor) => void;
}

export default function App({ mode, flavor, onModeChange, onFlavorChange }: AppProps) {
  const search = useSearchDialog();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              gap: { xs: 1.5, md: 2 },
              py: 1,
              minHeight: { xs: 56, md: 64 },
            }}
          >
            <Stack
              component={RouterLink}
              to="/"
              direction="row"
              spacing={1.25}
              sx={{
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                }}
              >
                X
              </Box>
              <Stack spacing={0} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Typography variant="overline" sx={{ lineHeight: 1, fontWeight: 700 }}>
                  @mui/x-chat
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                  Component gallery
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ flex: 1, minWidth: 0 }} />
            <Button
              variant="outlined"
              size="small"
              onClick={search.onOpen}
              startIcon={<SearchIcon />}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                borderColor: 'divider',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Search
              </Box>
              <Box
                component="span"
                sx={{
                  ml: { xs: 0, sm: 1 },
                  px: 0.75,
                  py: 0.125,
                  borderRadius: 0.5,
                  bgcolor: 'action.hover',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  display: { xs: 'none', md: 'inline' },
                }}
              >
                ⌘K
              </Box>
            </Button>
            <ButtonGroup size="small" variant="outlined" aria-label="Theme flavor">
              <Button
                variant={flavor === 'plain' ? 'contained' : 'outlined'}
                onClick={() => onFlavorChange('plain')}
                sx={{ textTransform: 'none' }}
              >
                Plain
              </Button>
              <Button
                variant={flavor === 'material' ? 'contained' : 'outlined'}
                onClick={() => onFlavorChange('material')}
                sx={{ textTransform: 'none' }}
              >
                Material
              </Button>
            </ButtonGroup>
            <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton
                size="small"
                onClick={() => onModeChange(isDark ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Routes>
          <Route path="/" element={<GalleryHomePage />} />
          <Route path="/component/:id" element={<ComponentDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <SearchDialog open={search.open} onClose={search.onClose} items={gallerySearchItems} />
    </Box>
  );
}
