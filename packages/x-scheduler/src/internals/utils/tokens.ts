import { CSSObject } from '@mui/material/styles';
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
  grey,
} from '@mui/material/colors';

/**
 * Material UI color palettes for scheduler events.
 */
const colorPalettes = {
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
  grey,
} as const;

export type PaletteName = keyof typeof colorPalettes;

/**
 * Generates palette variants for MUI styled components.
 * Use with styled components: `variants: getPaletteVariants()`
 */
export const getPaletteVariants = () => {
  return Object.entries(colorPalettes).map(([colorName, colorValues]) => ({
    props: { palette: colorName as PaletteName },
    style: {
      '--event-color-1': colorValues[50],
      '--event-color-2': colorValues[100],
      '--event-color-3': colorValues[200],
      '--event-color-4': colorValues[300],
      '--event-color-5': colorValues[400],
      '--event-color-6': colorValues[500],
      '--event-color-7': colorValues[600],
      '--event-color-8': colorValues[700],
      '--event-color-9': colorValues[800],
      '--event-color-10': colorValues[900],
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

  // Primary (using deepPurple)
  '--primary-1': deepPurple[50],
  '--primary-2': deepPurple[100],
  '--primary-3': deepPurple[200],
  '--primary-4': deepPurple[300],
  '--primary-5': deepPurple[400],
  '--primary-6': deepPurple[500],
  '--primary-7': deepPurple[600],
  '--primary-8': deepPurple[700],
  '--primary-9': deepPurple[800],
  '--primary-10': deepPurple[900],

  // Semantic aliases
  '--border-color': grey[200],
  '--weekend-background': grey[100],
  '--surface': 'white',
};
