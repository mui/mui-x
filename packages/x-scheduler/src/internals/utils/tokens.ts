import { CSSObject, Theme } from '@mui/material/styles';
import {
  red,
  pink,
  deepPurple,
  indigo,
  blue,
  cyan,
  teal,
  green,
  lime,
  amber,
  deepOrange,
  orange,
  grey,
} from '@mui/material/colors';

/**
 * Custom color mappings for scheduler events.
 * These are derived from Material UI color palettes but with custom selections
 * for optimal visual appearance in both light and dark modes.
 */
const eventColorTokens = {
  red: {
    light: {
      main: red[500],
      'surface-bold': red[400],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': red[600],
      'surface-subtle': red[50],
      'surface-subtle-hover': '#FEDCDF', // custom
      'surface-accent': red[900],
      'on-surface-subtle-primary': '#851414', // custom (darker than 900)
      'on-surface-subtle-secondary': red[900],
    },
    dark: {
      main: red[600],
      'surface-bold': red[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': red[800],
      'surface-subtle': '#681919', // custom
      'surface-subtle-hover': '#742B2B', // custom
      'surface-accent': red[200],
      'on-surface-subtle-primary': red[50],
      'on-surface-subtle-secondary': red[200],
    },
  },
  pink: {
    light: {
      main: pink[400],
      'surface-bold': pink[400],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': pink[500],
      'surface-subtle': pink[50],
      'surface-subtle-hover': '#FACCDC', // custom
      'surface-accent': pink[800],
      'on-surface-subtle-primary': pink[900],
      'on-surface-subtle-secondary': pink[800],
    },
    dark: {
      main: pink[600],
      'surface-bold': pink[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': pink[800],
      'surface-subtle': '#67103E', // custom
      'surface-subtle-hover': '#73234D', // custom
      'surface-accent': pink[200],
      'on-surface-subtle-primary': pink[50],
      'on-surface-subtle-secondary': pink[200],
    },
  },
  deepPurple: {
    light: {
      main: deepPurple[500],
      'surface-bold': deepPurple[500],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': deepPurple[600],
      'surface-subtle': deepPurple[50],
      'surface-subtle-hover': '#DCD2EE', // custom
      'surface-accent': deepPurple[800],
      'on-surface-subtle-primary': '#271574', // custom
      'on-surface-subtle-secondary': deepPurple[800],
    },
    dark: {
      main: deepPurple[700],
      'surface-bold': deepPurple[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': deepPurple[800],
      'surface-subtle': '#2E2066', // custom
      'surface-subtle-hover': '#3E3172', // custom
      'surface-accent': deepPurple[200],
      'on-surface-subtle-primary': deepPurple[50],
      'on-surface-subtle-secondary': deepPurple[200],
    },
  },
  indigo: {
    light: {
      main: indigo[500],
      'surface-bold': indigo[500],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': indigo[600],
      'surface-subtle': indigo[50],
      'surface-subtle-hover': '#D3D6EE', // custom
      'surface-accent': indigo[700],
      'on-surface-subtle-primary': indigo[900],
      'on-surface-subtle-secondary': indigo[700],
    },
    dark: {
      main: indigo[700],
      'surface-bold': indigo[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': indigo[800],
      'surface-subtle': '#19205E', // custom
      'surface-subtle-hover': '#2B316B', // custom
      'surface-accent': indigo[200],
      'on-surface-subtle-primary': indigo[50],
      'on-surface-subtle-secondary': indigo[200],
    },
  },
  blue: {
    light: {
      main: blue[600],
      'surface-bold': blue[600],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': blue[700],
      'surface-subtle': blue[50],
      'surface-subtle-hover': '#CAE5FC', // custom
      'surface-accent': blue[800],
      'on-surface-subtle-primary': '#0B3A84', // custom
      'on-surface-subtle-secondary': blue[800],
    },
    dark: {
      main: blue[700],
      'surface-bold': blue[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': blue[800],
      'surface-subtle': '#073070', // custom
      'surface-subtle-hover': '#1A407B', // custom
      'surface-accent': blue[200],
      'on-surface-subtle-primary': blue[50],
      'on-surface-subtle-secondary': blue[200],
    },
  },
  cyan: {
    light: {
      main: cyan[600],
      'surface-bold': cyan[600],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': cyan[700],
      'surface-subtle': cyan[50],
      'surface-subtle-hover': '#C4EFF4', // custom
      'surface-accent': cyan[800],
      'on-surface-subtle-primary': '#004D54', // custom
      'on-surface-subtle-secondary': cyan[800],
    },
    dark: {
      main: cyan[700],
      'surface-bold': cyan[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': cyan[800],
      'surface-subtle': '#003840', // custom
      'surface-subtle-hover': '#004D54', // custom
      'surface-accent': cyan[200],
      'on-surface-subtle-primary': cyan[50],
      'on-surface-subtle-secondary': cyan[200],
    },
  },
  teal: {
    light: {
      main: teal[500],
      'surface-bold': teal[500],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': teal[600],
      'surface-subtle': teal[50],
      'surface-subtle-hover': '#C9E9E6', // custom
      'surface-accent': teal[800],
      'on-surface-subtle-primary': teal[900],
      'on-surface-subtle-secondary': teal[800],
    },
    dark: {
      main: teal[700],
      'surface-bold': teal[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': teal[800],
      'surface-subtle': '#044036', // custom
      'surface-subtle-hover': '#184F46', // custom
      'surface-accent': teal[200],
      'on-surface-subtle-primary': teal[50],
      'on-surface-subtle-secondary': teal[200],
    },
  },
  green: {
    light: {
      main: green[600],
      'surface-bold': green[600],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': green[700],
      'surface-subtle': green[50],
      'surface-subtle-hover': '#D5ECD6', // custom
      'surface-accent': green[800],
      'on-surface-subtle-primary': '#164B1A', // custom
      'on-surface-subtle-secondary': green[800],
    },
    dark: {
      main: green[800],
      'surface-bold': green[800],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': green[900],
      'surface-subtle': '#0F3D13', // custom
      'surface-subtle-hover': '#224C26', // custom
      'surface-accent': green[200],
      'on-surface-subtle-primary': green[50],
      'on-surface-subtle-secondary': green[200],
    },
  },
  lime: {
    light: {
      main: lime[800],
      'surface-bold': '#959B1F', // custom
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': lime[900],
      'surface-subtle': lime[50],
      'surface-subtle-hover': '#F3F6D0', // custom
      'surface-accent': lime[900],
      'on-surface-subtle-primary': '#625A0D', // custom
      'on-surface-subtle-secondary': lime[900],
    },
    dark: {
      main: lime[800],
      'surface-bold': lime[900],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': '#706510', // custom
      'surface-subtle': '#50490A', // custom
      'surface-subtle-hover': '#5E571D', // custom
      'surface-accent': lime[200],
      'on-surface-subtle-primary': lime[50],
      'on-surface-subtle-secondary': lime[200],
    },
  },
  amber: {
    light: {
      main: amber[700],
      'surface-bold': '#CC8616', // custom
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': amber[800],
      'surface-subtle': amber[50],
      'surface-subtle-hover': '#FFEEBD', // custom
      'surface-accent': '#B68800', // custom
      'on-surface-subtle-primary': '#976200', // custom
      'on-surface-subtle-secondary': '#B68800', // custom
    },
    dark: {
      main: amber[700],
      'surface-bold': '#976200', // custom
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': '#845600', // custom
      'surface-subtle': '#8F5100', // custom
      'surface-subtle-hover': '#985F14', // custom
      'surface-accent': amber[200],
      'on-surface-subtle-primary': amber[50],
      'on-surface-subtle-secondary': amber[200],
    },
  },
  deepOrange: {
    light: {
      main: deepOrange[600],
      'surface-bold': deepOrange[600],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': deepOrange[700],
      'surface-subtle': deepOrange[50],
      'surface-subtle-hover': '#F7D9D4', // custom
      'surface-accent': deepOrange[800],
      'on-surface-subtle-primary': '#A13005', // custom
      'on-surface-subtle-secondary': deepOrange[800],
    },
    dark: {
      main: deepOrange[700],
      'surface-bold': deepOrange[800],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': deepOrange[900],
      'surface-subtle': '#6D2510', // custom
      'surface-subtle-hover': '#7D351F', // custom
      'surface-accent': deepOrange[200],
      'on-surface-subtle-primary': deepOrange[50],
      'on-surface-subtle-secondary': deepOrange[200],
    },
  },
  orange: {
    light: {
      main: orange[700],
      'surface-bold': orange[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': orange[800],
      'surface-subtle': orange[50],
      'surface-subtle-hover': '#FFE8C7', // custom
      'surface-accent': orange[900],
      'on-surface-subtle-primary': '#C24400', // custom
      'on-surface-subtle-secondary': orange[900],
    },
    dark: {
      main: orange[700],
      'surface-bold': deepOrange[900],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': '#A92D08', // custom
      'surface-subtle': '#9F4819', // custom
      'surface-subtle-hover': '#A7562B', // custom
      'surface-accent': orange[200],
      'on-surface-subtle-primary': orange[50],
      'on-surface-subtle-secondary': orange[200],
    },
  },
  grey: {
    light: {
      main: grey[600],
      'surface-bold': grey[600],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': grey[700],
      'surface-subtle': grey[50],
      'surface-subtle-hover': grey[200],
      'surface-accent': grey[800],
      'on-surface-subtle-primary': grey[900],
      'on-surface-subtle-secondary': grey[800],
    },
    dark: {
      main: grey[600],
      'surface-bold': grey[700],
      'on-surface-bold': '#FFFFFF',
      'surface-bold-hover': grey[800],
      'surface-subtle': '#303030', // custom
      'surface-subtle-hover': grey[800],
      'surface-accent': grey[400],
      'on-surface-subtle-primary': grey[50],
      'on-surface-subtle-secondary': grey[400],
    },
  },
} as const;

export type PaletteName = keyof typeof eventColorTokens;

/**
 * Generates palette variants for MUI styled components.
 * Use with styled components: `variants: getPaletteVariants(theme)`
 */
export const getPaletteVariants = (theme: Theme) => {
  return Object.entries(eventColorTokens).map(([colorName, colorValues]) => ({
    props: { palette: colorName as PaletteName },
    style: {
      '--event-main': colorValues.light.main,
      '--event-surface-bold': colorValues.light['surface-bold'],
      '--event-on-surface-bold': colorValues.light['on-surface-bold'],
      '--event-surface-bold-hover': colorValues.light['surface-bold-hover'],
      '--event-surface-subtle': colorValues.light['surface-subtle'],
      '--event-surface-subtle-hover': colorValues.light['surface-subtle-hover'],
      '--event-surface-accent': colorValues.light['surface-accent'],
      '--event-on-surface-subtle-primary': colorValues.light['on-surface-subtle-primary'],
      '--event-on-surface-subtle-secondary': colorValues.light['on-surface-subtle-secondary'],
      ...theme.applyStyles('dark', {
        '--event-main': colorValues.dark.main,
        '--event-surface-bold': colorValues.dark['surface-bold'],
        '--event-on-surface-bold': colorValues.dark['on-surface-bold'],
        '--event-surface-bold-hover': colorValues.dark['surface-bold-hover'],
        '--event-surface-subtle': colorValues.dark['surface-subtle'],
        '--event-surface-subtle-hover': colorValues.dark['surface-subtle-hover'],
        '--event-surface-accent': colorValues.dark['surface-accent'],
        '--event-on-surface-subtle-primary': colorValues.dark['on-surface-subtle-primary'],
        '--event-on-surface-subtle-secondary': colorValues.dark['on-surface-subtle-secondary'],
      }),
    } as CSSObject,
  }));
};

/**
 * CSS variable tokens for the scheduler.
 * These are applied to root components (EventCalendar, standalone views).
 */
export const schedulerTokens: CSSObject = {
  // Gray scale (using MUI grey)
  '--gray-1': grey[50],
  '--gray-2': grey[100],
  '--gray-3': grey[200],
  '--gray-4': grey[300],
  '--gray-5': grey[400],
  '--gray-6': grey[500],
  '--gray-7': grey[600],
  '--gray-8': grey[700],
  '--gray-9': grey[800],
  '--gray-10': grey[900],

  // Semantic aliases
  '--border-color': grey[200],
  '--weekend-background': grey[100],
  '--surface': 'white',
};
