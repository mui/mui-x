import { CSSObject } from '@mui/material/styles';

/**
 * CSS variable tokens for the scheduler.
 * These are applied to root components (EventCalendar, standalone views).
 */
export const schedulerTokens: CSSObject = {
  // Gray scale (using mauve)
  '--gray-1': 'var(--mauve-1)',
  '--gray-2': 'var(--mauve-2)',
  '--gray-3': 'var(--mauve-3)',
  '--gray-4': 'var(--mauve-4)',
  '--gray-5': 'var(--mauve-5)',
  '--gray-6': 'var(--mauve-6)',
  '--gray-7': 'var(--mauve-7)',
  '--gray-8': 'var(--mauve-8)',
  '--gray-9': 'var(--mauve-9)',
  '--gray-10': 'var(--mauve-10)',
  '--gray-11': 'var(--mauve-11)',
  '--gray-12': 'var(--mauve-12)',

  // Primary (using violet)
  '--primary-1': 'var(--violet-1)',
  '--primary-2': 'var(--violet-2)',
  '--primary-3': 'var(--violet-3)',
  '--primary-4': 'var(--violet-4)',
  '--primary-5': 'var(--violet-5)',
  '--primary-6': 'var(--violet-6)',
  '--primary-7': 'var(--violet-7)',
  '--primary-8': 'var(--violet-8)',
  '--primary-9': 'var(--violet-9)',
  '--primary-10': 'var(--violet-10)',
  '--primary-11': 'var(--violet-11)',
  '--primary-12': 'var(--violet-12)',

  // Mauve
  '--mauve-1': '#fdfcfd',
  '--mauve-2': '#faf9fb',
  '--mauve-3': '#f2eff3',
  '--mauve-4': '#eae7ec',
  '--mauve-5': '#e3dfe6',
  '--mauve-6': '#dbd8e0',
  '--mauve-7': '#d0cdd7',
  '--mauve-8': '#bcbac7',
  '--mauve-9': '#8e8c99',
  '--mauve-10': '#84828e',
  '--mauve-11': '#65636d',
  '--mauve-12': '#211f26',

  // Violet
  '--violet-1': '#fdfcfe',
  '--violet-2': '#faf8ff',
  '--violet-3': '#f4f0fe',
  '--violet-4': '#ebe4ff',
  '--violet-5': '#e1d9ff',
  '--violet-6': '#d4cafe',
  '--violet-7': '#c2b5f5',
  '--violet-8': '#aa99ec',
  '--violet-9': '#6e56cf',
  '--violet-10': '#654dc4',
  '--violet-11': '#3d317c',
  '--violet-12': '#2f265f',

  // Indigo
  '--indigo-1': '#fdfdfe',
  '--indigo-2': '#f7f9ff',
  '--indigo-3': '#edf2fe',
  '--indigo-4': '#e1e9ff',
  '--indigo-5': '#d2deff',
  '--indigo-6': '#c1d0ff',
  '--indigo-7': '#97abed',
  '--indigo-8': '#6c88e5',
  '--indigo-9': '#3e63dd',
  '--indigo-10': '#2b4fca',
  '--indigo-11': '#1f3a93',
  '--indigo-12': '#1f2d5c',

  // Blue
  '--blue-1': '#fafdfe',
  '--blue-2': '#edf6fd',
  '--blue-3': '#daedfb',
  '--blue-4': '#c8e4f9',
  '--blue-5': '#acd6f6',
  '--blue-6': '#88c4f2',
  '--blue-7': '#63b1ee',
  '--blue-8': '#2794e7',
  '--blue-9': '#1071bc',
  '--blue-10': '#0f66a9',
  '--blue-11': '#0b4f83',
  '--blue-12': '#093353',

  // Cyan
  '--cyan-1': '#fafdfe',
  '--cyan-2': '#f2fafb',
  '--cyan-3': '#def7f9',
  '--cyan-4': '#caf1f6',
  '--cyan-5': '#b5e9f0',
  '--cyan-6': '#9ddde7',
  '--cyan-7': '#7dcedc',
  '--cyan-8': '#3db9cf',
  '--cyan-9': '#00a2c7',
  '--cyan-10': '#107d98',
  '--cyan-11': '#135a6c',
  '--cyan-12': '#0d3c48',

  // Jade
  '--jade-1': '#fbfefd',
  '--jade-2': '#f4fbf7',
  '--jade-3': '#e6f7ed',
  '--jade-4': '#d6f1e3',
  '--jade-5': '#c3e9d7',
  '--jade-6': '#acdec8',
  '--jade-7': '#8bceb6',
  '--jade-8': '#56ba9f',
  '--jade-9': '#29a383',
  '--jade-10': '#26997b',
  '--jade-11': '#208368',
  '--jade-12': '#1d3b31',

  // Lime
  '--lime-1': '#fdfdf7',
  '--lime-2': '#f8f9e7',
  '--lime-3': '#f4f4d6',
  '--lime-4': '#f0f0c6',
  '--lime-5': '#e9eaae',
  '--lime-6': '#e1e2a2',
  '--lime-7': '#d5d694',
  '--lime-8': '#c8c97e',
  '--lime-9': '#b4b573',
  '--lime-10': '#9fa055',
  '--lime-11': '#74753e',
  '--lime-12': '#434323',

  // Yellow
  '--yellow-1': '#fffdf5',
  '--yellow-2': '#fff9e5',
  '--yellow-3': '#fff5d6',
  '--yellow-4': '#fff1c2',
  '--yellow-5': '#ffeeb8',
  '--yellow-6': '#ffe89e',
  '--yellow-7': '#ffe07a',
  '--yellow-8': '#ffd95c',
  '--yellow-9': '#ffcd29',
  '--yellow-10': '#e5ac00',
  '--yellow-11': '#996600',
  '--yellow-12': '#5c3d00',

  // Orange
  '--orange-1': '#fffcfa',
  '--orange-2': '#fff5ed',
  '--orange-3': '#ffe8d6',
  '--orange-4': '#ffdfb5',
  '--orange-5': '#ffd19a',
  '--orange-6': '#ffb882',
  '--orange-7': '#fdaa6a',
  '--orange-8': '#f89549',
  '--orange-9': '#f37019',
  '--orange-10': '#ef5f00',
  '--orange-11': '#cc4e00',
  '--orange-12': '#582d1d',

  // Red
  '--red-1': '#fffcfc',
  '--red-2': '#fff7f7',
  '--red-3': '#feebec',
  '--red-4': '#ffdbdc',
  '--red-5': '#ffcdce',
  '--red-6': '#fdbdbe',
  '--red-7': '#f4a9aa',
  '--red-8': '#eb8e90',
  '--red-9': '#e5484d',
  '--red-10': '#dc3e42',
  '--red-11': '#ce2c31',
  '--red-12': '#641723',

  // Pink
  '--pink-1': '#fefbfd',
  '--pink-2': '#fcedf6',
  '--pink-3': '#fbe0f0',
  '--pink-4': '#f9d2e9',
  '--pink-5': '#f7c5e3',
  '--pink-6': '#f5b7dc',
  '--pink-7': '#f3aad6',
  '--pink-8': '#ef8bc7',
  '--pink-9': '#eb73bb',
  '--pink-10': '#e548a6',
  '--pink-11': '#ce1d87',
  '--pink-12': '#701050',

  // Semantic aliases
  '--border-color': 'var(--mauve-3)',
  '--weekend-background': 'var(--mauve-2)',
  '--surface': 'white',
};

/**
 * Dark mode overrides for the scheduler tokens.
 */
export const schedulerTokensDark: CSSObject = {
  // Mauve dark
  '--mauve-1': '#121113',
  '--mauve-2': '#1a191b',
  '--mauve-3': '#232225',
  '--mauve-4': '#2b292d',
  '--mauve-5': '#323035',
  '--mauve-6': '#3c393f',
  '--mauve-7': '#49474e',
  '--mauve-8': '#625f69',
  '--mauve-9': '#6f6d78',
  '--mauve-10': '#7c7a85',
  '--mauve-11': '#b5b2bc',
  '--mauve-12': '#eeeef0',

  // Violet dark
  '--violet-1': '#14121f',
  '--violet-2': '#1b1525',
  '--violet-3': '#291f43',
  '--violet-4': '#33255b',
  '--violet-5': '#3c2e69',
  '--violet-6': '#473876',
  '--violet-7': '#56468b',
  '--violet-8': '#6958ad',
  '--violet-9': '#6e56cf',
  '--violet-10': '#7d66d9',
  '--violet-11': '#baa7ff',
  '--violet-12': '#e2ddfe',

  // Indigo dark
  '--indigo-1': '#11131f',
  '--indigo-2': '#141726',
  '--indigo-3': '#182449',
  '--indigo-4': '#1d2e62',
  '--indigo-5': '#253974',
  '--indigo-6': '#304384',
  '--indigo-7': '#3a4f97',
  '--indigo-8': '#435db1',
  '--indigo-9': '#3e63dd',
  '--indigo-10': '#5472e4',
  '--indigo-11': '#9eb1ff',
  '--indigo-12': '#d6e1ff',

  // Blue dark
  '--blue-1': '#01121e',
  '--blue-2': '#011727',
  '--blue-3': '#02233b',
  '--blue-4': '#072840',
  '--blue-5': '#093353',
  '--blue-6': '#093e67',
  '--blue-7': '#0b4f83',
  '--blue-8': '#0f66a9',
  '--blue-9': '#1071bc',
  '--blue-10': '#2794e7',
  '--blue-11': '#47a3eb',
  '--blue-12': '#acd6f6',

  // Cyan dark
  '--cyan-1': '#0b161a',
  '--cyan-2': '#101b20',
  '--cyan-3': '#082c36',
  '--cyan-4': '#003848',
  '--cyan-5': '#004558',
  '--cyan-6': '#045468',
  '--cyan-7': '#12677e',
  '--cyan-8': '#11809c',
  '--cyan-9': '#00a2c7',
  '--cyan-10': '#23afd0',
  '--cyan-11': '#4ccce6',
  '--cyan-12': '#b6ecf7',

  // Jade dark
  '--jade-1': '#0d1512',
  '--jade-2': '#121c18',
  '--jade-3': '#0f2e22',
  '--jade-4': '#0b3b2c',
  '--jade-5': '#114837',
  '--jade-6': '#1b5745',
  '--jade-7': '#246854',
  '--jade-8': '#2a7e68',
  '--jade-9': '#29a383',
  '--jade-10': '#27b08b',
  '--jade-11': '#1fd8a4',
  '--jade-12': '#adf0d4',

  // Lime dark
  '--lime-1': '#14140b',
  '--lime-2': '#1b1b0e',
  '--lime-3': '#222211',
  '--lime-4': '#282815',
  '--lime-5': '#36361c',
  '--lime-6': '#4a4a26',
  '--lime-7': '#646434',
  '--lime-8': '#77783f',
  '--lime-9': '#95964f',
  '--lime-10': '#afb069',
  '--lime-11': '#cbcc85',
  '--lime-12': '#dddeb0',

  // Yellow dark
  '--yellow-1': '#1f1400',
  '--yellow-2': '#291b00',
  '--yellow-3': '#332200',
  '--yellow-4': '#3d2900',
  '--yellow-5': '#523600',
  '--yellow-6': '#704b00',
  '--yellow-7': '#996600',
  '--yellow-8': '#cc9900',
  '--yellow-9': '#ffc000',
  '--yellow-10': '#ffcd29',
  '--yellow-11': '#ffd95c',
  '--yellow-12': '#fff1c2',

  // Orange dark
  '--orange-1': '#17120e',
  '--orange-2': '#1e160f',
  '--orange-3': '#331e0b',
  '--orange-4': '#462100',
  '--orange-5': '#562800',
  '--orange-6': '#66350c',
  '--orange-7': '#7e451d',
  '--orange-8': '#a35829',
  '--orange-9': '#f76b15',
  '--orange-10': '#ff801f',
  '--orange-11': '#ffa057',
  '--orange-12': '#ffe0c2',

  // Red dark
  '--red-1': '#191111',
  '--red-2': '#201314',
  '--red-3': '#3b1219',
  '--red-4': '#500f1c',
  '--red-5': '#611623',
  '--red-6': '#72232d',
  '--red-7': '#8c333a',
  '--red-8': '#b54548',
  '--red-9': '#e5484d',
  '--red-10': '#ec5d5e',
  '--red-11': '#ff9592',
  '--red-12': '#ffd1d9',

  // Pink dark
  '--pink-1': '#1f0416',
  '--pink-2': '#2d0620',
  '--pink-3': '#43052e',
  '--pink-4': '#55063b',
  '--pink-5': '#701050',
  '--pink-6': '#861360',
  '--pink-7': '#aa1870',
  '--pink-8': '#ce1d87',
  '--pink-9': '#e543a4',
  '--pink-10': '#eb73bb',
  '--pink-11': '#f5b7dc',
  '--pink-12': '#f9d2e9',

  // Semantic aliases dark
  '--border-color': 'var(--mauve-4)',
  '--weekend-background': 'var(--mauve-2)',
  '--surface': 'var(--mauve-1)',
};

/**
 * Creates a palette definition for data-palette attribute styling.
 */
const createPaletteStyle = (colorName: string): CSSObject => ({
  '--event-color-1': `var(--${colorName}-1)`,
  '--event-color-2': `var(--${colorName}-2)`,
  '--event-color-3': `var(--${colorName}-3)`,
  '--event-color-4': `var(--${colorName}-4)`,
  '--event-color-5': `var(--${colorName}-5)`,
  '--event-color-6': `var(--${colorName}-6)`,
  '--event-color-7': `var(--${colorName}-7)`,
  '--event-color-8': `var(--${colorName}-8)`,
  '--event-color-9': `var(--${colorName}-9)`,
  '--event-color-10': `var(--${colorName}-10)`,
  '--event-color-11': `var(--${colorName}-11)`,
  '--event-color-12': `var(--${colorName}-12)`,
});

/**
 * Palette styles for event colors using data-palette attribute.
 * Use with styled components: `...schedulerPaletteStyles`
 */
export const schedulerPaletteStyles: CSSObject = {
  '&[data-palette="primary"]': createPaletteStyle('primary'),
  '&[data-palette="mauve"]': createPaletteStyle('mauve'),
  '&[data-palette="violet"]': createPaletteStyle('violet'),
  '&[data-palette="cyan"]': createPaletteStyle('cyan'),
  '&[data-palette="jade"]': createPaletteStyle('jade'),
  '&[data-palette="red"]': createPaletteStyle('red'),
  '&[data-palette="pink"]': createPaletteStyle('pink'),
  '&[data-palette="orange"]': createPaletteStyle('orange'),
  '&[data-palette="yellow"]': createPaletteStyle('yellow'),
  '&[data-palette="lime"]': createPaletteStyle('lime'),
  '&[data-palette="blue"]': createPaletteStyle('blue'),
  '&[data-palette="indigo"]': createPaletteStyle('indigo'),
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
