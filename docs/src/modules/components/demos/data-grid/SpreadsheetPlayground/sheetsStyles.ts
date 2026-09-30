import type { Theme, SxProps } from '@mui/material/styles';

export type RefPaletteId = 'default' | 'sheets' | 'contrast';

// Reference-highlighting palettes applied through the public
// `--DataGrid-formulaRefColor-0…9` CSS variables. `default` leaves the
// built-in palette untouched.
const REF_PALETTES: Record<
  Exclude<RefPaletteId, 'default'>,
  { light: string[]; dark: string[] }
> = {
  sheets: {
    light: [
      '#0b57d0',
      '#d93025',
      '#188038',
      '#e37400',
      '#8430ce',
      '#007b83',
      '#b80672',
      '#5f6368',
      '#1967d2',
      '#ea8600',
    ],
    dark: [
      '#8ab4f8',
      '#f28b82',
      '#81c995',
      '#fdd663',
      '#d7aefb',
      '#78d9ec',
      '#ff8bcb',
      '#bdc1c6',
      '#aecbfa',
      '#fcad70',
    ],
  },
  contrast: {
    light: [
      '#0000cc',
      '#cc0000',
      '#006600',
      '#994c00',
      '#660099',
      '#005c66',
      '#99004d',
      '#333333',
      '#003399',
      '#804000',
    ],
    dark: [
      '#99ccff',
      '#ff9999',
      '#99ff99',
      '#ffcc80',
      '#e6b3ff',
      '#80eaff',
      '#ff99cc',
      '#e6e6e6',
      '#b3c6ff',
      '#ffd699',
    ],
  },
};

export function getRefPaletteVars(palette: RefPaletteId, mode: 'light' | 'dark') {
  if (palette === 'default') {
    return {};
  }
  const colors = REF_PALETTES[palette][mode];
  return Object.fromEntries(
    colors.map((color, index) => [`--DataGrid-formulaRefColor-${index}`, color]),
  );
}

// The grid declares the default `--DataGrid-formulaRefColor-*` values on the
// highlight overlay, the formula editor, and the formula bar themselves, and
// the nearest CSS-variable declaration wins — so the override must target
// those elements (and their descendants), not the grid root.
const REF_PALETTE_SCOPE = [
  '& .MuiDataGrid-formulaReferenceOverlay',
  '& .MuiDataGrid-formulaReferenceOverlay *',
  '& .MuiDataGrid-formulaEditor',
  '& .MuiDataGrid-formulaEditor *',
  '& .MuiDataGrid-formulaEditorSurface',
  '& .MuiDataGrid-formulaEditorSurface *',
  '& .MuiDataGrid-formulaBar',
  '& .MuiDataGrid-formulaBar *',
].join(', ');

// Compact Sheets-like heights, set directly on the grid props instead of
// through `density="compact"` — the density factor rescales the real rows
// (32 → 22) but not the empty-area gridline pattern below, which must repeat
// at exactly the rendered row height to line up.
/** Row height shared by the grid prop and the empty-area gridline pattern. */
export const SHEETS_ROW_HEIGHT = 28;
/** Column header height shared by the grid prop. */
export const SHEETS_HEADER_HEIGHT = 32;

/** Width of the fake columns drawn right of the last real column. */
const SHEETS_EMPTY_COLUMN_WIDTH = 100;

// The Google Sheets palette (current Material 3 era), expressed as local CSS
// custom properties so the light and dark values live in one place. All the
// chrome components consume `var(--sheets-*)`.
export const containerSx: SxProps<Theme> = (theme) => ({
  '--sheets-chrome': '#f9fbfd',
  '--sheets-pill': '#edf2fa',
  '--sheets-line': '#dadce0',
  '--sheets-hairline': '#c7c7c7',
  '--sheets-header-bg': '#f8f9fa',
  '--sheets-header-text': '#5f6368',
  '--sheets-accent': '#0b57d0',
  '--sheets-text': '#1f1f1f',
  // Sheets renders cell values in pure black, noticeably darker than the
  // chrome text — keeping the two separate matches the real app.
  '--sheets-cell-text': '#000000',
  '--sheets-icon': '#444746',
  '--sheets-bar-bg': '#ffffff',
  '--sheets-grid-bg': '#ffffff',
  '--sheets-hover': 'rgba(68, 71, 70, 0.08)',
  // Conditional-formatting colors (the Google Sheets preset palette).
  '--sheets-cond-good-bg': '#d4edbc',
  '--sheets-cond-good-text': '#11734b',
  '--sheets-cond-warn-bg': '#ffe5a0',
  '--sheets-cond-warn-text': '#473821',
  '--sheets-cond-bad-bg': '#ffcfc9',
  '--sheets-cond-bad-text': '#b10202',
  ...theme.applyStyles('dark', {
    '--sheets-chrome': '#131314',
    '--sheets-pill': '#2d2f31',
    '--sheets-line': '#3c4043',
    '--sheets-hairline': '#3c4043',
    '--sheets-header-bg': '#2a2b2e',
    '--sheets-header-text': '#bdc1c6',
    '--sheets-accent': '#a8c7fa',
    '--sheets-text': '#e3e3e3',
    '--sheets-cell-text': '#e3e3e3',
    '--sheets-icon': '#c4c7c5',
    '--sheets-bar-bg': '#1f1f1f',
    '--sheets-grid-bg': '#1f1f1f',
    '--sheets-hover': 'rgba(196, 199, 197, 0.12)',
    '--sheets-cond-good-bg': 'rgba(129, 201, 149, 0.18)',
    '--sheets-cond-good-text': '#81c995',
    '--sheets-cond-warn-bg': 'rgba(253, 214, 99, 0.16)',
    '--sheets-cond-warn-text': '#fdd663',
    '--sheets-cond-bad-bg': 'rgba(242, 139, 130, 0.18)',
    '--sheets-cond-bad-text': '#f28b82',
  }),
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: { xs: 'calc(100vh - 320px)', md: 'calc(100vh - 260px)' },
  minHeight: 640,
  border: '1px solid var(--sheets-line)',
  borderRadius: 1,
  overflow: 'hidden',
  backgroundColor: 'var(--sheets-chrome)',
  fontFamily: 'Arial, Helvetica, sans-serif',
});

// The Sheets skin for the grid itself, applied through the grid's public CSS
// design tokens. Recoloring `interactive-focus` restyles the focus ring, the
// cell-selection range borders, and the fill handle in one place.
const gridBaseStyles = {
  border: 'none',
  borderRadius: 0,
  borderTop: '1px solid var(--sheets-hairline)',
  backgroundColor: 'var(--sheets-grid-bg)',
  color: 'var(--sheets-cell-text)',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: '13px',
  // `!important` is required: the grid compiles the theme's tokens into its
  // own unlayered `MuiDataGridVariables-*` class on the root, while the docs
  // renderer wraps all emotion styles (`sx` included) in `@layer mui` —
  // unlayered declarations beat layered ones at any specificity, so a plain
  // declaration of these tokens silently loses.
  '--DataGrid-t-radius-base': '0px !important',
  '--DataGrid-t-color-border-base': 'var(--sheets-line) !important',
  '--DataGrid-t-header-background-base': 'var(--sheets-header-bg) !important',
  '--DataGrid-t-color-interactive-focus': 'var(--sheets-accent) !important',
  '--DataGrid-t-color-interactive-selected': 'var(--sheets-accent) !important',
  '--DataGrid-t-color-interactive-hover': 'var(--sheets-accent) !important',
  '--DataGrid-t-color-interactive-hover-opacity': '0 !important',
  '& .MuiDataGrid-columnHeaderTitle': {
    color: 'var(--sheets-header-text)',
    fontSize: '11px',
    fontWeight: 400,
  },
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  // The auto-injected row-number column reads as the Sheets row header.
  '& .MuiDataGrid-cell[data-field="__formula_row_number__"]': {
    backgroundColor: 'var(--sheets-header-bg)',
    color: 'var(--sheets-header-text)',
    fontSize: '11px',
  },
  // Tint the pinned constants and totals rows so they read as chrome.
  '& .MuiDataGrid-pinnedRows .MuiDataGrid-cell': {
    backgroundColor: 'var(--sheets-header-bg)',
  },
  // Continue the gridlines into the empty areas the way Sheets does: fake
  // 100px columns right of the last real column, and horizontal lines in the
  // leftover space below the last row.
  '& .MuiDataGrid-cellEmpty': {
    backgroundImage: `repeating-linear-gradient(to right, transparent 0 ${SHEETS_EMPTY_COLUMN_WIDTH - 1}px, var(--sheets-line) ${SHEETS_EMPTY_COLUMN_WIDTH - 1}px ${SHEETS_EMPTY_COLUMN_WIDTH}px)`,
  },
  '& .MuiDataGrid-virtualScroller .MuiDataGrid-filler': {
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${SHEETS_ROW_HEIGHT - 1}px, var(--sheets-line) ${SHEETS_ROW_HEIGHT - 1}px ${SHEETS_ROW_HEIGHT}px)`,
  },
  // The sticky pinned section of that filler paints its own background over
  // the gradient — restate the lines there, tinted like the row-number
  // header it continues. `border-box` origin keeps the pattern aligned with
  // the parent despite the section's 1px top border.
  '& .MuiDataGrid-virtualScroller .MuiDataGrid-filler--pinnedLeft': {
    backgroundColor: 'var(--sheets-header-bg)',
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${SHEETS_ROW_HEIGHT - 1}px, var(--sheets-line) ${SHEETS_ROW_HEIGHT - 1}px ${SHEETS_ROW_HEIGHT}px)`,
    backgroundOrigin: 'border-box',
    borderRight: '1px solid var(--sheets-line)',
  },
  // With zero visible rows (a filter that matches nothing) the grid reserves
  // space for its centered "No results found." overlay and the filler no
  // longer starts at the row rhythm — hide the fake gridlines and let the
  // overlay own the empty space.
  '& .MuiDataGrid-virtualScroller:has(.MuiDataGrid-overlayWrapper) .MuiDataGrid-filler': {
    backgroundImage: 'none',
  },
  '& .MuiDataGrid-virtualScroller:has(.MuiDataGrid-overlayWrapper) .MuiDataGrid-filler--pinnedLeft':
    {
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      borderRight: 'none',
    },
  '& .MuiDataGrid-columnHeaders .MuiDataGrid-filler': {
    backgroundImage: 'none',
  },
  // Conditional formatting applied through `cellClassName` on the evaluated
  // formula values (see playgroundData.ts).
  '& .sheets-cond--good': {
    backgroundColor: 'var(--sheets-cond-good-bg)',
    color: 'var(--sheets-cond-good-text)',
  },
  '& .sheets-cond--warn': {
    backgroundColor: 'var(--sheets-cond-warn-bg)',
    color: 'var(--sheets-cond-warn-text)',
  },
  '& .sheets-cond--bad': {
    backgroundColor: 'var(--sheets-cond-bad-bg)',
    color: 'var(--sheets-cond-bad-text)',
  },
  // The formula bar renders as the grid toolbar — style it as the Sheets bar.
  '& .MuiDataGrid-toolbar': {
    padding: 0,
    minHeight: 0,
    border: 'none',
    backgroundColor: 'var(--sheets-bar-bg)',
  },
  '& .MuiDataGrid-formulaBar': {
    width: '100%',
    backgroundColor: 'var(--sheets-bar-bg)',
    borderBottom: '1px solid var(--sheets-hairline)',
  },
} as const;

export function makeGridSx(palette: RefPaletteId): SxProps<Theme> {
  return (theme) => ({
    ...gridBaseStyles,
    ...(palette === 'default'
      ? null
      : {
          [REF_PALETTE_SCOPE]: {
            ...getRefPaletteVars(palette, 'light'),
            ...theme.applyStyles('dark', getRefPaletteVars(palette, 'dark')),
          },
        }),
  });
}
