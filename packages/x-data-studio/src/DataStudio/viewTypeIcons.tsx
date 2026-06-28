'use client';
import * as React from 'react';
import { createSvgIcon } from '@mui/material/utils';

// Icons per built-in Sheet/view type, used to make Sheets recognisable in the
// sidebar + tab bar. Paths mirror the Composer template-card icons.

const GridIcon = createSvgIcon(
  <path d="M3 3h18v18H3V3zm2 2v4h4V5H5zm6 0v4h4V5h-4zm6 0v4h2V5h-2zM5 11v4h4v-4H5zm6 0v4h4v-4h-4zm6 0v4h2v-4h-2zM5 17v2h4v-2H5zm6 0v2h4v-2h-4zm6 0v2h2v-2h-2z" />,
  'GridSheet',
);
const SpreadsheetIcon = createSvgIcon(
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5zm2-8h4v2H7v-2zm0 4h4v2H7v-2zm6-4h4v2h-4v-2zm0 4h4v2h-4v-2zM7 7h10v2H7V7z" />,
  'SpreadsheetSheet',
);
const PivotIcon = createSvgIcon(
  <path d="M3 3h18v18H3V3zm2 2v4h4V5H5zm6 0v4h8V5h-8zM5 11v8h4v-8H5zm6 0v8h8v-8h-8z" />,
  'PivotSheet',
);
const ChartIcon = createSvgIcon(
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />,
  'ChartSheet',
);
const DashboardIcon = createSvgIcon(
  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
  'DashboardSheet',
);

const VIEW_TYPE_ICONS: Record<string, typeof GridIcon> = {
  grid: GridIcon,
  spreadsheet: SpreadsheetIcon,
  pivot: PivotIcon,
  chart: ChartIcon,
  dashboard: DashboardIcon,
};

/** The icon component for a Sheet's view type (defaults to the grid icon). */
export function getSheetTypeIcon(type: string | undefined): typeof GridIcon {
  return (type && VIEW_TYPE_ICONS[type]) || GridIcon;
}
