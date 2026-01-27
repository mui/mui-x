import { CSSObject } from '@mui/material/styles';
import {
  red,
  green,
  pink,
  deepPurple,
  indigo,
  blue,
  teal,
  lime,
  amber,
  deepOrange,
} from '@mui/material/colors';

const colorPalettes = { red, green, pink, deepPurple, indigo, blue, teal, lime, amber, deepOrange };

export const getPaletteStyles = () => {
  return Object.entries(colorPalettes).map(([colorName, colorValues]) => [
    {
      props: { palette: colorName },
      style: {
        '--event-color-1': colorValues[50],
        '--event-color-2': colorValues[100],
        '--event-color-3': colorValues[200],
        '--event-color-4': colorValues[300],
        '--event-color-4-rgb': `${colorValues[300]
          .replace('#', '')
          .match(/.{2}/g)
          ?.map((hex) => parseInt(hex, 16))
          .join(', ')}`,
        '--event-color-5': colorValues[400],
        '--event-color-6': colorValues[500],
        '--event-color-7': colorValues[600],
        '--event-color-8': colorValues[700],
        '--event-color-9': colorValues[800],
        '--event-color-10': colorValues[900],
      },
    },
  ]);
};

/**
 * All available palette names.
 */
export const PALETTE_NAMES = [
  'primary',
  'mauve',
  'violet',
  'cyan',
  'jade',
  'red',
  'pink',
  'orange',
  'yellow',
  'lime',
  'blue',
  'indigo',
] as const;

export type PaletteName = (typeof PALETTE_NAMES)[number];
