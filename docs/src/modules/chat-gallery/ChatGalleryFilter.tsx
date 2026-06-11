import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { getServerSnapshot, getSnapshot, setQuery, subscribe } from './galleryFilterStore';

/**
 * Single outlined text input that drives the all-components gallery filter.
 * Writes to the module-level store so every section grid (each its own React
 * root) stays in sync. Embedded once from `all-components.md`, above the grids.
 */
export default function ChatGalleryFilter() {
  const query = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <TextField
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Filter components…"
      size="small"
      fullWidth
      variant="outlined"
      sx={{ mt: 1, mb: 1, maxWidth: 360 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: query ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear filter"
                size="small"
                edge="end"
                onClick={() => setQuery('')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
