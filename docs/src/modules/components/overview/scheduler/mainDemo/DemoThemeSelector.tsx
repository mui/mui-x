import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getSoftEdgesTheme } from '../theme/softEdgesTheme';
import { getNeutralVibesTheme } from '../theme/neutralVibesTheme';

export type CustomThemeName = 'default' | 'softEdges' | 'neutralVibes';

// Use CSS variables to avoid first load light/dark blink.
const darkThemeManagement = {
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
};

const themeOptions: { value: CustomThemeName; label: string }[] = [
  { value: 'default', label: 'Default theme' },
  { value: 'softEdges', label: 'Soft edges' },
  { value: 'neutralVibes', label: 'Neutral vibes' },
];

export type DemoThemeSelectorProps = {
  ariaLabel: string;
  selectedTheme: CustomThemeName;
  onThemeChange: (event: SelectChangeEvent) => void;
};

export function DemoThemeSelector({
  ariaLabel,
  selectedTheme,
  onThemeChange,
}: DemoThemeSelectorProps) {
  return (
    <Select
      aria-label={ariaLabel}
      value={selectedTheme}
      onChange={onThemeChange}
      size="small"
      sx={{ minWidth: 160 }}
    >
      {themeOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

type SchedulerDemoThemeProviderProps = {
  children: React.ReactNode;
  selectedTheme: CustomThemeName;
};

export function SchedulerDemoThemeProvider({
  children,
  selectedTheme,
}: SchedulerDemoThemeProviderProps) {
  const brandingTheme = useTheme();
  const { direction } = brandingTheme;
  const mode = brandingTheme.palette.mode;
  const demoThemes = React.useMemo(
    () => ({
      default: createTheme(darkThemeManagement, { direction, palette: { mode } }),
      softEdges: getSoftEdgesTheme(mode, direction),
      neutralVibes: getNeutralVibesTheme(mode, direction),
    }),
    [mode, direction],
  );

  return <ThemeProvider theme={demoThemes[selectedTheme]}>{children}</ThemeProvider>;
}
