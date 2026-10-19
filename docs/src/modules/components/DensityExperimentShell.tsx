// Shared layout for the density enhancer review pages (`docs/pages/x/density-experiment*.js`).
// Remove or turn into docs demos before merge.
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  createTheme,
  ThemeProvider,
  unstable_enhanceDensity as enhanceMaterial,
  Theme,
} from '@mui/material/styles';

const pages = [
  { href: '/x/density-experiment/', label: 'Data Grid' },
  { href: '/x/density-experiment-pickers/', label: 'Date and Time Pickers' },
  { href: '/x/density-experiment-tree-view/', label: 'Tree View' },
  { href: '/x/density-experiment-charts/', label: 'Charts' },
];

const vanilla = createTheme({ cssVariables: true });

/**
 * The material enhancer followed by the X enhancer under review. The enhanced
 * theme gets its own `cssVarPrefix`: a nested ThemeProvider that reuses the
 * outer prefix skips its style sheet, so every `var(--mui-*)` ref would fall
 * back to the literal.
 */
export function createEnhancedTheme(enhanceX: (theme: Theme) => Theme) {
  return enhanceX(enhanceMaterial(createTheme({ cssVariables: { cssVarPrefix: 'density' } })));
}

interface DensityExperimentShellProps {
  title: string;
  description: React.ReactNode;
  enhanced: Theme;
  /** Theme component names whose emitted `defaultProps` are printed under each column. */
  componentNames: string[];
  children: (theme: Theme) => React.ReactNode;
}

function Column({
  title,
  theme,
  componentNames,
  children,
}: Omit<DensityExperimentShellProps, 'description' | 'enhanced'> & { theme: Theme }) {
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
  const { title, description, enhanced, componentNames, children } = props;
  return (
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
  );
}
