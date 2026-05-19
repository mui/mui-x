import { createSvgIcon } from '@mui/material/utils';

export const GridBarChartIcon = createSvgIcon(
  <g transform="rotate(90 12 12)">
    <rect height="7" width="4" x="4" y="13" />
    <rect height="16" width="4" x="10" y="4" />
    <rect height="11" width="4" x="16" y="9" />
  </g>,
  'BarChart',
);

export const GridColumnChartIcon = createSvgIcon(
  <g>
    <rect height="11" width="4" x="4" y="9" />
    <rect height="7" width="4" x="16" y="13" />
    <rect height="16" width="4" x="10" y="4" />
  </g>,
  'ColumnChart',
);

export const GridLineChartIcon = createSvgIcon(
  <path d="M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11c-0.18,0-0.36-0.02-0.52-0.07l-4.55,4.56 C4.98,15.65,5,15.82,5,16c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9 c0-1.1,0.9-2,2-2s2,0.9,2,2c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12c0.18,0,0.36,0.02,0.52,0.07 l3.55-3.56C19.02,8.35,19,8.18,19,8c0-1.1,0.9-2,2-2S23,6.9,23,8z" />,
  'LineChart',
);

export const GridAreaChartIcon = createSvgIcon(
  <path d="M3,13v7h18v-1.5l-9-7L8,17L3,13z M3,7l4,3l5-7l5,4h4v8.97l-9.4-7.31l-3.98,5.48L3,10.44V7z" />,
  'AreaChart',
);

export const GridPieChartIcon = createSvgIcon(
  <path d="M11,5.08V2C6,2.5,2,6.81,2,12s4,9.5,9,10v-3.08c-3-0.48-6-3.4-6-6.92S8,5.56,11,5.08z M18.97,11H22c-0.47-5-4-8.53-9-9 v3.08C16,5.51,18.54,8,18.97,11z M13,18.92V22c5-0.47,8.53-4,9-9h-3.03C18.54,16,16,18.49,13,18.92z" />,
  'PieChart',
);

export const GridChartsPaletteIcon = createSvgIcon(
  <g>
    <path fill="var(--color-1)" d="M8 9H4v11h4V9Z" />
    <path fill="var(--color-2)" d="M14 4h-4v16h4V4Z" />
    <path fill="var(--color-3)" d="M16 13h4v7h-4v-7Z" />
  </g>,
  'ChartsPalette',
);
