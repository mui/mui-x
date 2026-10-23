import * as React from 'react';
import NextLink from 'next/link';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ThemeOptionsContext } from '@mui/internal-core-docs/ThemeContext';
import experimentTitles from 'docs/data/experiments/titles.json';

const sidebarWidth = 260;
const storageKey = 'mui-x-experiments-sidebar';
const experimentPages = JSON.parse(process.env.EXPERIMENT_PAGES || '[]');
const groups = {};

function formatName(name) {
  const label = name.replaceAll('-', ' ').replaceAll('/', ' / ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

experimentPages.forEach((experiment) => {
  const [firstSegment, ...rest] = experiment.split('/');
  const group = rest.length > 0 ? formatName(firstSegment) : 'Other';
  const name = rest.length > 0 ? rest.join('/') : firstSegment;

  groups[group] ??= [];
  groups[group].push({
    name: experimentTitles[experiment] || (name === 'index' ? 'Overview' : formatName(name)),
    href: `/experiments/${experiment.replace(/\/index$/, '')}`,
  });
});

// eslint-disable-next-line react/prop-types
export function ExperimentLayout({ children }) {
  const { paletteMode, direction } = React.useContext(ThemeOptionsContext);
  const router = useRouter();
  const activeExperiment = Object.values(groups)
    .flat()
    .find((experiment) => experiment.href === router.pathname);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode: paletteMode },
        direction,
        colorSchemes: { light: true, dark: true },
        cssVariables: { colorSchemeSelector: 'data-mui-color-scheme' },
      }),
    [paletteMode, direction],
  );
  const sidebarQuery = theme.breakpoints.up('sm').replace(/^@media\s*/, '');
  const isWide = useMediaQuery(sidebarQuery);
  const [sidebarVisible, setSidebarVisible] = React.useState(null);

  useEnhancedEffect(() => {
    let visible = window.matchMedia(sidebarQuery).matches;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null) {
        visible = stored !== 'hidden';
      }
    } catch {
      // Browsers can disable session storage.
    }
    setSidebarVisible(visible);
  }, [sidebarQuery]);

  const changeSidebarVisible = (visible) => {
    setSidebarVisible(visible);
    try {
      sessionStorage.setItem(storageKey, visible ? 'visible' : 'hidden');
    } catch {
      // Navigation still works when session storage is disabled.
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <NextHead>
        <title>
          {activeExperiment ? `${activeExperiment.name} - MUI X experiments` : 'MUI X experiments'}
        </title>
      </NextHead>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Drawer
          variant={isWide ? 'persistent' : 'temporary'}
          anchor={direction === 'rtl' ? 'right' : 'left'}
          open={sidebarVisible === true}
          onClose={() => changeSidebarVisible(false)}
          sx={{
            width: isWide && sidebarVisible ? sidebarWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: sidebarWidth, p: 2 },
          }}
        >
          <Box component="nav" aria-label="Experiments">
            <Link
              component={NextLink}
              href="/experiments/"
              color="inherit"
              underline="none"
              sx={{ display: 'block', fontWeight: 600, mb: 2 }}
            >
              MUI X experiments
            </Link>
            <Button
              fullWidth
              size="small"
              startIcon={<ChevronLeftIcon />}
              onClick={() => changeSidebarVisible(false)}
              sx={{ mb: 3 }}
            >
              Hide sidebar
            </Button>
            <Typography
              component="h2"
              variant="overline"
              sx={{ color: 'text.secondary', fontWeight: 700 }}
            >
              All experiments
            </Typography>
            {Object.entries(groups).map(([group, experiments]) => (
              <Box key={group} sx={{ mb: 2 }}>
                <Typography
                  component="h3"
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                  {group}
                </Typography>
                <List dense disablePadding sx={{ pl: 1 }}>
                  {experiments.map((experiment) => {
                    const selected = router.pathname === experiment.href;
                    return (
                      <ListItem key={experiment.href} disablePadding>
                        <ListItemButton
                          component={NextLink}
                          href={experiment.href}
                          selected={selected}
                          aria-current={selected ? 'page' : undefined}
                          onClick={() => {
                            if (!isWide) {
                              changeSidebarVisible(false);
                            }
                          }}
                          sx={{ px: 1, py: 0.5, borderRadius: 1, fontSize: '0.875rem' }}
                        >
                          {experiment.name}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            ))}
          </Box>
        </Drawer>
        {sidebarVisible === false && (
          <IconButton
            aria-label="Show sidebar"
            title="Show sidebar"
            onClick={() => changeSidebarVisible(true)}
            sx={{
              position: 'fixed',
              insetInlineStart: 0,
              top: '50%',
              zIndex: theme.zIndex.drawer,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
        <Box component="main" sx={{ flex: 1, minWidth: 0, p: '20px' }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
