import * as React from 'react';
import {
  Box,
  Chip,
  Dialog,
  InputAdornment,
  List,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { gallerySearchItems } from '../galleryRegistry';

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79L19 20.49 20.49 19zM10 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
    </svg>
  );
}

export type SearchItemStatus =
  | 'section'
  | 'core'
  | 'compound'
  | 'slot'
  | 'state'
  | 'presentational'
  | 'stable'
  | 'new'
  | 'updated'
  | 'experimental'
  | 'deprecated';

export interface SearchItem {
  id: string;
  title: string;
  section: string;
  status?: SearchItemStatus | string;
  description?: string;
  keywords?: readonly string[];
  parent?: string;
  importName?: string;
  sourcePath?: string;
  docsPath?: string;
  slots?: readonly string[];
  classKeys?: readonly string[];
}

export interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
  shortcutLabel?: string;
}

const statusLabels: Record<string, string> = {
  section: 'Section',
  core: 'Core',
  compound: 'Compound',
  slot: 'Slot',
  state: 'State',
  presentational: 'Presentational',
  stable: 'Stable',
  new: 'New',
  updated: 'Updated',
  experimental: 'Experimental',
  deprecated: 'Deprecated',
};

const statusColors: Record<
  string,
  'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
> = {
  section: 'default',
  core: 'primary',
  compound: 'secondary',
  slot: 'info',
  state: 'warning',
  presentational: 'success',
  stable: 'success',
  new: 'primary',
  updated: 'info',
  experimental: 'warning',
  deprecated: 'error',
};

function getStatusLabel(status: SearchItem['status']) {
  return status ? (statusLabels[status] ?? status) : null;
}

function normalizeTitle(title: string) {
  return title
    .replace(/\s*\(.+\)$/, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function mergeStringLists(
  first: readonly string[] | undefined,
  second: readonly string[] | undefined,
) {
  const values = [...(first ?? []), ...(second ?? [])];
  return values.length > 0 ? Array.from(new Set(values)) : undefined;
}

function getItemScore(item: SearchItem) {
  return [
    item.status,
    item.description,
    item.parent,
    item.sourcePath,
    item.slots?.length,
    item.classKeys?.length,
    item.keywords?.length,
  ].filter(Boolean).length;
}

function mergeSearchItem(existing: SearchItem, next: SearchItem): SearchItem {
  const primary = getItemScore(next) >= getItemScore(existing) ? next : existing;

  return {
    ...existing,
    ...next,
    id: primary.id,
    title: primary.title,
    section: next.section || existing.section,
    status: next.status ?? existing.status,
    description: next.description ?? existing.description,
    parent: next.parent ?? existing.parent,
    importName: next.importName ?? existing.importName,
    sourcePath: next.sourcePath ?? existing.sourcePath,
    docsPath: next.docsPath ?? existing.docsPath,
    keywords: mergeStringLists(existing.keywords, next.keywords),
    slots: next.slots ?? existing.slots,
    classKeys: next.classKeys ?? existing.classKeys,
  };
}

function mergeSearchItems(...groups: Array<readonly SearchItem[]>) {
  const map = new Map<string, SearchItem>();

  groups.flat().forEach((item) => {
    const key = normalizeTitle(item.title);
    const existing = map.get(key);
    map.set(key, existing ? mergeSearchItem(existing, item) : item);
  });

  return Array.from(map.values());
}

export function getPlatformShortcutLabel() {
  if (typeof navigator === 'undefined') {
    return 'Ctrl K';
  }

  const platform = navigator.platform || navigator.userAgent;
  const isApple = /Mac|iPhone|iPad|iPod/.test(platform);
  return isApple ? '⌘K' : 'Ctrl K';
}

function isResolvable(item: SearchItem) {
  return Boolean(item.status || item.description || item.slots?.length || item.classKeys?.length);
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="kbd"
      sx={{
        px: 0.75,
        py: 0.25,
        borderRadius: 0.75,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
        color: 'text.secondary',
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        lineHeight: 1.4,
      }}
    >
      {children}
    </Box>
  );
}

export function SearchDialog({
  open,
  onClose,
  items,
  shortcutLabel: shortcutLabelProp,
}: SearchDialogProps) {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const shortcutLabel = shortcutLabelProp ?? getPlatformShortcutLabel();

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const allItems = React.useMemo(
    () => mergeSearchItems(items, gallerySearchItems).filter(isResolvable),
    [items],
  );

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) {
      return allItems;
    }
    const lower = query.toLowerCase();
    return allItems.filter((item) =>
      [
        item.title,
        item.section,
        item.status,
        item.description,
        item.parent,
        item.importName,
        item.sourcePath,
        ...(item.keywords ?? []),
        ...(item.slots ?? []),
        ...(item.classKeys ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(lower),
    );
  }, [allItems, query]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.status === 'section') {
      navigate(`/?section=${item.id}`);
    } else {
      navigate(`/component/${item.id}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxHeight: '70vh',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="Search components, slots, class keys..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ color: 'action.active', display: 'flex' }}>
                    <SearchIcon />
                  </Box>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'action.hover',
            },
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1, alignItems: 'center', color: 'text.secondary', flexWrap: 'wrap' }}
        >
          <Typography variant="caption">Open with</Typography>
          <Kbd>{shortcutLabel}</Kbd>
          <Typography variant="caption">Close with</Typography>
          <Kbd>Esc</Kbd>
        </Stack>
      </Box>
      <List sx={{ py: 1, maxHeight: 440, overflow: 'auto' }}>
        {filteredItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No components found</Typography>
          </Box>
        ) : (
          filteredItems.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleSelect(item)}
              sx={{ py: 1.25, px: 2, alignItems: 'flex-start' }}
            >
              <Stack spacing={0.5} sx={{ minWidth: 0, width: '100%' }}>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </Typography>
                  {item.status ? (
                    <Chip
                      size="small"
                      color={statusColors[item.status] ?? 'default'}
                      variant="outlined"
                      label={getStatusLabel(item.status)}
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
                    />
                  ) : null}
                </Stack>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {item.section}
                  </Typography>
                  {item.parent ? (
                    <Typography variant="caption" color="text.secondary">
                      in {item.parent}
                    </Typography>
                  ) : null}
                  {item.slots?.length ? (
                    <Chip
                      size="small"
                      label={`${item.slots.length} slots`}
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  ) : null}
                  {item.classKeys?.length ? (
                    <Chip
                      size="small"
                      label={`${item.classKeys.length} classes`}
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  ) : null}
                </Stack>
                {item.description ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {item.description}
                  </Typography>
                ) : null}
              </Stack>
            </ListItemButton>
          ))
        )}
      </List>
    </Dialog>
  );
}

export function useSearchDialog() {
  const [open, setOpen] = React.useState(false);
  const shortcutLabel = getPlatformShortcutLabel();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    shortcutLabel,
  };
}
