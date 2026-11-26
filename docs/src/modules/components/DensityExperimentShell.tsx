// Shared layout for the density enhancer review pages (`docs/pages/x/density-experiment*.js`).
// Remove or turn into docs demos before merge.
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { DensityScaleOverrides, Theme } from '@mui/material/styles';
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
  unstable_enhanceDensity as enhanceMaterial,
} from '@mui/material/styles';

const pages = [
  { href: '/x/density-experiment/', label: 'Data Grid' },
  { href: '/x/density-experiment-pickers/', label: 'Date and Time Pickers' },
  { href: '/x/density-experiment-tree-view/', label: 'Tree View' },
  { href: '/x/density-experiment-charts/', label: 'Charts' },
];

const scales: Record<string, DensityScaleOverrides> = {
  low: {
    spacing: { xxSmall: 8, xSmall: 12, small: 16, medium: 24, large: 32, xLarge: 48, xxLarge: 64 },
    touchTarget: 44,
    iconSize: 24,
  },
  high: {
    spacing: { xxSmall: 2, xSmall: 4, small: 8, medium: 12, large: 16, xLarge: 24, xxLarge: 32 },
    touchTarget: 24,
    iconSize: 12,
  },
};

interface QueryOptions {
  scale: string | null;
  layers: boolean;
  mode: 'light' | 'dark';
}

function useQueryOptions() {
  const [options, setOptions] = React.useState<QueryOptions | null>(null);
  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setOptions({
      scale: query.get('scale'),
      layers: query.get('layers') === 'modular',
      mode: query.get('mode') === 'dark' ? 'dark' : 'light',
    });
  }, []);
  return options;
}

interface DensityExperimentShellProps {
  title: string;
  description: React.ReactNode;
  enhance: (theme: Theme) => Theme;
  /** Theme component names whose emitted `defaultProps` are printed under each column. */
  componentNames: string[];
  children: (theme: Theme) => React.ReactNode;
}

function Column({
  title,
  theme,
  componentNames,
  children,
}: Omit<DensityExperimentShellProps, 'description' | 'enhance'> & { theme: Theme }) {
  const scale = theme.unstable_densityScale;
  const components = theme.components as Record<string, any> | undefined;
  const defaultProps = Object.fromEntries(
    componentNames
      .filter((name) => components?.[name]?.defaultProps)
      .map((name) => [name, components?.[name].defaultProps]),
  );
  const slotCount = componentNames.reduce(
    (count, name) => count + Object.keys(components?.[name]?.styleOverrides ?? {}).length,
    0,
  );
  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }} className={title.toLowerCase()}>
        <Typography variant="h6">{title}</Typography>
        {children(theme)}
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            fontSize: 12,
            bgcolor: 'action.hover',
            borderRadius: 1,
            overflow: 'auto',
          }}
        >
          {`theme.unstable_densityScale = ${scale ? JSON.stringify(scale, null, 2) : 'undefined'}\n`}
          {`defaultProps = ${JSON.stringify(defaultProps, null, 2)}\n`}
          {`styleOverrides slots: ${slotCount}`}
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default function DensityExperimentShell(props: DensityExperimentShellProps) {
  const { title, description, enhance, componentNames, children } = props;
  const options = useQueryOptions();
  const scale = options?.scale ?? null;
  const layers = options?.layers ?? false;
  const mode = options?.mode ?? 'light';
  const vanilla = React.useMemo(
    () =>
      createTheme({
        cssVariables: true,
        focusVisible: true,
        modularCssLayers: layers,
        palette: { mode },
      }),
    [layers, mode],
  );
  // The enhanced theme gets its own `cssVarPrefix`: a nested ThemeProvider that
  // reuses the outer prefix skips its style sheet, so every `var(--mui-*)` ref
  // would fall back to the literal.
  const enhanced = React.useMemo(
    () =>
      enhance(
        enhanceMaterial(
          createTheme({
            cssVariables: { cssVarPrefix: 'density' },
            focusVisible: true,
            modularCssLayers: layers,
            palette: { mode },
          }),
          scale ? scales[scale] : undefined,
        ),
      ),
    [enhance, scale, layers, mode],
  );
  if (!options) {
    return null;
  }
  return (
    <StyledEngineProvider enableCssLayer={layers}>
      <ThemeProvider theme={vanilla}>
        <CssBaseline />
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
            {pages.map((page) => (
              <Link key={page.href} href={page.href}>
                {page.label}
              </Link>
            ))}
          </Stack>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 3 }}>
            {description}
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Column title="Vanilla" theme={vanilla} componentNames={componentNames}>
              {children}
            </Column>
            <Column title="Enhanced" theme={enhanced} componentNames={componentNames}>
              {children}
            </Column>
          </Stack>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
