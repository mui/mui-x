import * as React from 'react';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider, styled, useColorScheme } from '@mui/material/styles';
import { getDesignTokens, getThemedComponents } from '@mui/docs/branding';
import deepmerge from '@mui/utils/deepmerge';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SvgIcon from '@mui/material/SvgIcon';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';

import { demoMetadata as stockDashboardMetadata } from './StockDashboard/StockDashboard';
import { demoMetadata as inventoryMetadata } from './Inventory/InventoryDashboard';
import { demoMetadata as ptoCalendarMetadata } from './PTOCalendar/PTOCalendar';

function MuiLogomark() {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{
        width: 28,
        height: 28,
        color: 'primary.main',
        cursor: 'pointer',
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 5.601V1.592a.344.344 0 0 0-.514-.298l-2.64 1.508a.688.688 0 0 0-.346.597v4.009c0 .264.285.43.514.298l2.64-1.508A.688.688 0 0 0 24 5.6ZM.515 1.295l7.643 4.383a.688.688 0 0 0 .684 0l7.643-4.383a.344.344 0 0 1 .515.298v12.03c0 .235-.12.453-.319.58l-4.65 2.953 3.11 1.832c.22.13.495.127.713-.009l4.61-2.878a.344.344 0 0 0 .161-.292v-4.085c0-.254.14-.486.362-.606l2.507-1.346a.344.344 0 0 1 .506.303v7.531c0 .244-.13.47-.34.593l-7.834 4.592a.688.688 0 0 1-.71-.009l-5.953-3.681A.344.344 0 0 1 9 18.808v-3.624c0-.115.057-.222.153-.286l4.04-2.694a.688.688 0 0 0 .307-.572v-4.39a.137.137 0 0 0-.208-.117l-4.44 2.664a.688.688 0 0 1-.705.002L3.645 7.123a.138.138 0 0 0-.208.118v7.933a.344.344 0 0 1-.52.295L.5 14.019C.19 13.833 0 13.497 0 13.135V1.593c0-.264.286-.43.515-.298Z"
      />
    </SvgIcon>
  );
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottom: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxShadow: 'none',
  backgroundImage: 'none',
  zIndex: theme.zIndex.drawer + 1,
  flex: '0 0 auto',
  'html:has(&)': {
    '--frame-height': '30px',
    '& [data-screenshot="toggle-mode"]': { display: 'none' },
    '& .MuiInputBase-root:has(> [data-screenshot="toggle-mode"])': { display: 'none' },
  },
}));

const defaultTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
});

function ColorSchemeControls() {
  const { mode, systemMode, setMode } = useColorScheme();

  const effectiveMode = mode === 'system' ? systemMode : mode;

  if (!effectiveMode) {
    return (
      <Box
        sx={(theme) => {
          const borderColor =
            theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
          return {
            verticalAlign: 'bottom',
            display: 'inline-flex',
            width: 32,
            height: 32,
            borderRadius: (theme.vars || theme).shape.borderRadius,
            border: '1px solid',
            borderColor: theme.vars
              ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`
              : borderColor,
          };
        }}
      />
    );
  }

  const handleToggle = () => {
    const newMode = effectiveMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const icon = effectiveMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />;
  const tooltipTitle = effectiveMode === 'light' ? 'Turn the light off' : 'Turn the light on';

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        onClick={handleToggle}
        color="primary"
        size="small"
        disableTouchRipple
        aria-label={tooltipTitle}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

const { palette: lightPalette, typography, ...designTokens } = getDesignTokens('light');
const { palette: darkPalette } = getDesignTokens('dark');

const brandingTheme = createTheme({
  cssVariables: {
    cssVarPrefix: 'muidocs',
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: lightPalette,
    },
    dark: {
      palette: darkPalette,
    },
  },
  ...designTokens,
  typography: deepmerge(typography, {
    h1: {
      ':where([data-mui-color-scheme="dark"]) &': {
        color: 'var(--muidocs-palette-common-white)',
      },
    },
    h2: {
      ':where([data-mui-color-scheme="dark"]) &': {
        color: 'var(--muidocs-palette-grey-100)',
      },
    },
    h5: {
      ':where([data-mui-color-scheme="dark"]) &': {
        color: 'var(--muidocs-palette-primary-300)',
      },
    },
  }),
  ...getThemedComponents(),
});

const demoMetadataMap = {
  'real-time-data': stockDashboardMetadata,
  inventory: inventoryMetadata,
  'time-off-calendar': ptoCalendarMetadata,
};

interface DataGridDemoFrameProps {
  children: React.ReactNode;
  demoName: keyof typeof demoMetadataMap;
}

export default function DataGridDemoFrame({ children, demoName }: DataGridDemoFrameProps) {
  const router = useRouter();

  const metadata = demoMetadataMap[demoName];
  const title = metadata.title;
  const description = metadata.description;

  const allDemos = Object.keys(demoMetadataMap) as Array<keyof typeof demoMetadataMap>;

  return (
    <ThemeProvider theme={defaultTheme} disableTransitionOnChange>
      <Box
        sx={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {router.query?.hideFrame !== 'true' && (
          <ThemeProvider theme={brandingTheme}>
            <StyledAppBar className="Docs-dataGridDemoFrame">
              <Toolbar
                variant="dense"
                disableGutters
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  p: '6px 12px',
                  gap: 1,
                  minHeight: 'var(--frame-height)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flex: '0 1 auto',
                  }}
                >
                  <Box
                    component="a"
                    href="/"
                    onContextMenu={(event) => event.preventDefault()}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      p: 0.5,
                    }}
                  >
                    <MuiLogomark />
                  </Box>
                  <Button
                    variant="text"
                    size="small"
                    aria-label="Back to the docs"
                    startIcon={<ArrowBackRoundedIcon />}
                    component="a"
                    href="/x/react-data-grid/"
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Back to the docs
                  </Button>
                  <IconButton
                    size="small"
                    aria-label="Back to the docs"
                    component="a"
                    href="/x/react-data-grid/"
                    sx={{ display: { xs: 'auto', sm: 'none' } }}
                  >
                    <ArrowBackRoundedIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    alignItems: 'center',
                    minWidth: 0,
                    flex: '0 1 auto',
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: 'none', lg: 'flex' },
                      gap: 0.5,
                      minWidth: 0,
                    }}
                  >
                    {allDemos.map((demo) => {
                      const isCurrentDemo = demo === demoName;
                      return (
                        <Button
                          key={demo}
                          variant={isCurrentDemo ? 'contained' : 'outlined'}
                          size="small"
                          component={isCurrentDemo ? 'button' : 'a'}
                          href={isCurrentDemo ? undefined : `/x/react-data-grid/demos/${demo}`}
                          disabled={isCurrentDemo}
                          sx={{
                            fontSize: '0.75rem',
                            px: 1,
                            py: 0.5,
                            maxWidth: '120px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            ...(isCurrentDemo
                              ? {
                                  '&.Mui-disabled': {
                                    backgroundColor: 'secondary.light',
                                    color: 'secondary.contrastText',
                                    borderColor: 'divider',
                                    opacity: 1,
                                  },
                                }
                              : {
                                  borderColor: 'divider',
                                  color: 'text.secondary',
                                  '&:hover': {
                                    color: 'primary.main',
                                    borderColor: 'divider',
                                  },
                                }),
                          }}
                        >
                          {demoMetadataMap[demo].label}
                        </Button>
                      );
                    })}
                  </Box>
                  <Tooltip title="See demo on GitHub">
                    <IconButton
                      color="primary"
                      size="small"
                      disableTouchRipple
                      aria-label="See demo on GitHub"
                      data-ga-event-category="mui-x-data-grid-demo"
                      data-ga-event-label={demoName}
                      data-ga-event-action="github"
                      onClick={() => {
                        // TODO: Link to GitHub repos / stackblitz / codesandbox ?
                      }}
                      sx={{ alignSelf: 'center', borderRadius: 1 }}
                    >
                      <SvgIcon viewBox="0 0 24 24">
                        <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27" />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                  <ColorSchemeControls />
                </Box>
              </Toolbar>
            </StyledAppBar>
          </ThemeProvider>
        )}
        <Box
          sx={{
            flex: '1 1',
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              flex: '1 1',
              overflowY: 'auto',
              overflowX: 'hidden',
              p: { xs: 2, sm: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '1600px',
              width: '100%',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2.25rem' },
                  fontWeight: '600',
                  lineHeight: 1.2,
                  pt: 2,
                  mb: 2,
                  fontFamily: 'General Sans',
                  wordBreak: 'break-word',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                className="description"
                sx={{
                  fontSize: '1.125rem',
                  color: 'text.secondary',
                  fontFamily: 'IBM Plex Sans',
                  wordBreak: 'break-word',
                }}
              >
                {description}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              {React.isValidElement(children) ? React.cloneElement(children, {}) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
