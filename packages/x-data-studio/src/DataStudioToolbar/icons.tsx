// Inline SVG icons for the Data Studio toolbar. We don't depend on
// `@mui/icons-material` (not a peer dep) so these are minimal Material-style
// paths created via `@mui/material/utils`'s `createSvgIcon`.
import { createSvgIcon } from '@mui/material/utils';

export const PrintIcon = createSvgIcon(
  <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />,
  'Print',
);

export const FunctionsIcon = createSvgIcon(
  <path d="M18 4H6v2l6.5 6L6 18v2h12v-3h-7l5-5-5-5h7z" />,
  'Functions',
);

export const DensitySmallIcon = createSvgIcon(
  <path d="M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2zm0 4h18v2H3v-2zm0-8h18v2H3V7z" />,
  'DensitySmall',
);

// Used by the Insert > Comment item in the menu bar.
export const InsertCommentIcon = createSvgIcon(
  <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4 -.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />,
  'Comment',
);

export const ChevronRightIcon = createSvgIcon(
  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />,
  'ChevronRight',
);

export const BrightnessIcon = createSvgIcon(
  <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18V6c3.31 0 6 2.69 6 6s-2.69 6-6 6z" />,
  'Brightness',
);

export const MoreVertIcon = createSvgIcon(
  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />,
  'MoreVert',
);

export const StarIcon = createSvgIcon(
  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />,
  'Star',
);

export const FolderIcon = createSvgIcon(
  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />,
  'Folder',
);

export const CloudDoneIcon = createSvgIcon(
  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z" />,
  'CloudDone',
);

export const HistoryIcon = createSvgIcon(
  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />,
  'History',
);

export const AccountCircleIcon = createSvgIcon(
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />,
  'AccountCircle',
);

export const VideoCamIcon = createSvgIcon(
  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />,
  'VideoCam',
);

export const ShareIcon = createSvgIcon(
  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />,
  'Share',
);

export const SparkleIcon = createSvgIcon(
  <path d="M12 1L9 9 1 12l8 3 3 8 3-8 8-3-8-3z" />,
  'Sparkle',
);

// Sort by — generic sort affordance (descending list). Used for the toolbar's
// multi-sort menu trigger.
export const SortIcon = createSvgIcon(
  <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />,
  'Sort',
);

// Row grouping — three rows with the first nested under a folder-style bracket.
export const GroupIcon = createSvgIcon(
  <g>
    <path d="M3 5h18v2H3z" />
    <path d="M6 9h15v2H6z" />
    <path d="M6 13h15v2H6z" />
    <path d="M6 17h15v2H6z" />
    <path d="M4 9h1v10H4z" />
  </g>,
  'GroupBy',
);

// Pivot — table with an arrow indicating axis swap.
export const PivotIcon = createSvgIcon(
  <g>
    <path d="M3 3h8v8H3z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M13 13h8v8h-8z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M13 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M5 13l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
  </g>,
  'Pivot',
);

// Refresh — circular arrow.
export const RefreshIcon = createSvgIcon(
  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />,
  'Refresh',
);

// Save / bookmark-add — floppy-disk style.
export const SaveIcon = createSvgIcon(
  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />,
  'Save',
);

// Reset / restart — counter-clockwise arrow.
export const ResetIcon = createSvgIcon(
  <path d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />,
  'Reset',
);

// Autosize columns — two arrows pointing outward (fit to width).
export const AutosizeIcon = createSvgIcon(
  <g>
    <path d="M4 9v6H2V9h2zm18 0v6h-2V9h2z" />
    <path d="M6 11l3-3v2h6V8l3 3-3 3v-2H9v2z" />
  </g>,
  'AutosizeColumns',
);

// Pin (push-pin shape) — used for the column pinning menu trigger.
export const PinIcon = createSvgIcon(
  <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />,
  'Pin',
);

// Bar chart — used by the toolbar "+ Chart" button that adds a chart view.
export const BarChartIcon = createSvgIcon(
  <g>
    <path d="M5 9.2h3V19H5z" />
    <path d="M10.6 5h2.8v14h-2.8z" />
    <path d="M16.2 13H19v6h-2.8z" />
  </g>,
  'BarChart',
);
