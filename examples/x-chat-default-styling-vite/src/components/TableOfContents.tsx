import * as React from 'react';
import {
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { GallerySectionInfo } from '../sections/ComponentsGallery';

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

export interface TableOfContentsProps {
  sections: GallerySectionInfo[];
}

type TableOfContentsEntry = NonNullable<GallerySectionInfo['entries']>[number];

const statusLabels: Record<string, string> = {
  core: 'Core',
  compound: 'Compound',
  slot: 'Slot',
  state: 'State',
  presentational: 'Presentational',
};

const statusColors: Record<
  string,
  'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning'
> = {
  core: 'primary',
  compound: 'secondary',
  slot: 'info',
  state: 'warning',
  presentational: 'success',
};

function getTargets(sections: GallerySectionInfo[]) {
  return sections.flatMap((section) => [
    { id: section.id, sectionId: section.id },
    ...(section.entries ?? []).map((entry) => ({ id: entry.id, sectionId: section.id })),
  ]);
}

function getStatusLabel(status: TableOfContentsEntry['status']) {
  return statusLabels[status] ?? status;
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const targets = React.useMemo(() => getTargets(sections), [sections]);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (let i = targets.length - 1; i >= 0; i -= 1) {
        const element = document.getElementById(targets[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(targets[i].id);
          return;
        }
      }
      setActiveId(null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targets]);

  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.history.pushState(null, '', `#${id}`);
      setMobileOpen(false);
      requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const content = (
    <Box sx={{ py: 2 }}>
      <Typography
        variant="overline"
        sx={{ px: 2, color: 'text.secondary', fontWeight: 700, letterSpacing: 0.5 }}
      >
        Components
      </Typography>
      <List dense disablePadding sx={{ mt: 1 }}>
        {sections.map((section) => {
          const entries = section.entries ?? [];
          const isSectionActive =
            activeId === section.id || entries.some((entry) => entry.id === activeId);

          return (
            <Box key={section.id}>
              <ListItemButton
                selected={isSectionActive}
                onClick={() => handleClick(section.id)}
                sx={{
                  py: 0.75,
                  px: 2,
                  borderLeft: '3px solid',
                  borderColor: isSectionActive ? 'primary.main' : 'transparent',
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isSectionActive ? 700 : 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {section.count} component{section.count !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </ListItemButton>
              {entries.map((entry) => {
                const isEntryActive = activeId === entry.id;

                return (
                  <ListItemButton
                    key={entry.id}
                    selected={isEntryActive}
                    onClick={() => handleClick(entry.id)}
                    sx={{
                      minHeight: 34,
                      py: 0.35,
                      pl: 3.5,
                      pr: 1.5,
                      borderLeft: '3px solid',
                      borderColor: isEntryActive ? 'primary.main' : 'transparent',
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.75,
                        alignItems: 'center',
                        minWidth: 0,
                        width: '100%',
                      }}
                    >
                      <Typography
                        variant="caption"
                        title={entry.title}
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          fontWeight: isEntryActive ? 700 : 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: isEntryActive ? 'text.primary' : 'text.secondary',
                        }}
                      >
                        {entry.title}
                      </Typography>
                      <Chip
                        size="small"
                        color={statusColors[entry.status] ?? 'default'}
                        variant="outlined"
                        label={getStatusLabel(entry.status)}
                        sx={{
                          display: { xs: 'none', sm: 'inline-flex' },
                          height: 18,
                          fontSize: '0.625rem',
                          maxWidth: 86,
                        }}
                      />
                    </Box>
                  </ListItemButton>
                );
              })}
            </Box>
          );
        })}
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 24,
          alignSelf: 'flex-start',
          width: 220,
          flexShrink: 0,
          display: { xs: 'none', lg: 'block' },
          borderRight: '1px solid',
          borderColor: 'divider',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 'calc(16px + env(safe-area-inset-bottom))',
          right: 'calc(16px + env(safe-area-inset-right))',
          zIndex: 1100,
          width: 48,
          height: 48,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: 3,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 'min(88vw, 340px)', sm: 340 },
              pt: 'env(safe-area-inset-top)',
              pb: 'env(safe-area-inset-bottom)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <CloseIcon />
          </IconButton>
        </Box>
        {content}
      </Drawer>
    </React.Fragment>
  );
}
