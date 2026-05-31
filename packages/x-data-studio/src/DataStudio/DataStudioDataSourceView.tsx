'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import { createSvgIcon } from '@mui/material/utils';
import { styled } from '../internals/zero-styled';
import type { DataStudioDataSource } from './DataStudio.types';

const ChartIcon = createSvgIcon(
  <path d="M22 21H2V3h2v16h2v-9h4v9h2V6h4v13h2v-5h4v7z" />,
  'BarChart',
);
const PivotIcon = createSvgIcon(
  <path d="M19 6V3h-3v3h-4V3H9v3H3v3h3v4H3v3h3v3h3v-3h4v3h3v-3h3v-3h-3v-4h3V6h-3zm-7 7H9v-4h3v4zm0-4v0zm4 4h-4V9h4v4z" />,
  'Pivot',
);
const DashboardIcon = createSvgIcon(
  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
  'Dashboard',
);
const DataSourceIcon = createSvgIcon(
  <path d="M12 3C7.58 3 4 4.34 4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6c0-1.66-3.58-3-8-3zm6 15c0 .5-2.69 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V18zm0-4.55c-1.3.95-3.58 1.55-6 1.55s-4.7-.6-6-1.55V11.7c1.47.85 3.61 1.3 6 1.3s4.53-.45 6-1.3v1.75zM12 11c-3.31 0-6-1.5-6-2s2.69-2 6-2 6 1.5 6 2-2.69 2-6 2z" />,
  'DataSource',
);

const PreviewRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
});

const PreviewHeader = styled('div')(({ theme }) => ({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1.5),
  gap: theme.spacing(1),
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: theme.alpha((theme.vars || theme).palette.success.main, 0.1),
}));

const PreviewHeaderTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontWeight: 600,
  fontSize: '0.875rem',
  color: (theme.vars || theme).palette.success.dark,
}));

const PreviewHeaderTitleIcon = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: theme.alpha((theme.vars || theme).palette.success.main, 0.18),
  color: (theme.vars || theme).palette.success.dark,
  '& > svg': {
    width: 14,
    height: 14,
  },
}));

const PreviewActionBar = styled('div')(({ theme }) => ({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const PreviewActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8125rem',
  height: 32,
  padding: theme.spacing(0, 1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.alpha((theme.vars || theme).palette.text.primary, 0.12)}`,
  color: (theme.vars || theme).palette.text.primary,
  transition: theme.transitions.create(['background-color', 'border-color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:first-of-type': {
    marginLeft: theme.spacing(-1),
  },
  '&:hover': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.04),
  },
  '&:active': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.08),
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.alpha((theme.vars || theme).palette.primary.main, 0.5)}`,
    outlineOffset: 2,
  },
  '&.Mui-disabled': {
    color: (theme.vars || theme).palette.text.disabled,
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
  },
  '& .MuiButton-startIcon > svg': {
    fontSize: 16,
  },
}));

const PreviewGridArea = styled('div')({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
});

export interface DataStudioDataSourceViewProps {
  /** The active Data Source whose preview is being rendered. */
  dataSource: DataStudioDataSource;
  /** Inner grid to render in the preview area (typically read-only). */
  children: React.ReactNode;
  /** Create a Chart sheet bound to this Data Source. */
  onAddChartSheet: () => void;
  /** Create a Pivot sheet bound to this Data Source. */
  onAddPivotSheet: () => void;
  /** Create a Dashboard sheet bound to this Data Source. */
  onAddDashboardSheet: () => void;
}

/**
 * BigQuery-Connected-Sheets-style preview pane. Renders for the active Data
 * Source when no Sheet is open: header → action bar → preview grid.
 *
 * Action buttons spawn new Sheets seeded with this Data Source: Chart + Pivot
 * (the wired v1 actions). Not-yet-built actions are omitted rather than shown
 * disabled.
 */
export function DataStudioDataSourceView(props: DataStudioDataSourceViewProps) {
  const { dataSource, children, onAddChartSheet, onAddPivotSheet, onAddDashboardSheet } = props;
  const label = typeof dataSource.label === 'string' ? dataSource.label : String(dataSource.label);

  return (
    <PreviewRoot>
      <PreviewHeader>
        <PreviewHeaderTitle>
          <PreviewHeaderTitleIcon>
            <DataSourceIcon aria-hidden />
          </PreviewHeaderTitleIcon>
          {label}
        </PreviewHeaderTitle>
      </PreviewHeader>
      <PreviewActionBar role="toolbar" aria-label="Data source actions">
        <PreviewActionButton
          size="small"
          startIcon={<ChartIcon />}
          onClick={onAddChartSheet}
          aria-label="Create a chart from this data source"
        >
          Chart
        </PreviewActionButton>
        <PreviewActionButton
          size="small"
          startIcon={<PivotIcon />}
          onClick={onAddPivotSheet}
          aria-label="Create a pivot table from this data source"
        >
          Pivot table
        </PreviewActionButton>
        <PreviewActionButton
          size="small"
          startIcon={<DashboardIcon />}
          onClick={onAddDashboardSheet}
          aria-label="Create a dashboard from this data source"
        >
          Dashboard
        </PreviewActionButton>
      </PreviewActionBar>
      <PreviewGridArea>{children}</PreviewGridArea>
    </PreviewRoot>
  );
}
