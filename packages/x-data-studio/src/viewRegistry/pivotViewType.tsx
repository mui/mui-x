'use client';
import * as React from 'react';
import { DataGridPremium, type GridPivotModel } from '@mui/x-data-grid-premium';
import { styled } from '../internals/zero-styled';
import {
  DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
  DATA_STUDIO_PIVOT_MEASURE_CELL_CLASS,
  DATA_STUDIO_PIVOT_MEASURE_HEADER_CLASS,
  getDataStudioPivotingColDef,
} from '../DataStudio/gridDefaults';
import type { DataStudioViewRenderProps, DataStudioViewType } from './types';

const EMPTY_PIVOT_MODEL: GridPivotModel = { rows: [], columns: [], values: [] };

const PivotRoot = styled('div')({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  // Keep the generated aggregation header (e.g. `Units (sum)`) on a single line
  // so it never wraps to a ragged two-line stack that breaks the header row.
  [`& .${DATA_STUDIO_PIVOT_MEASURE_HEADER_CLASS} .MuiDataGrid-columnHeaderTitle`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // Tabular figures so aggregated values (and the footer total) align in one
  // optical column.
  [`& .${DATA_STUDIO_PIVOT_MEASURE_CELL_CLASS}`]: {
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
  },
});

const PivotEmpty = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: 'center',
  fontSize: '0.8125rem',
  lineHeight: 1.5,
  color: theme.alpha((theme.vars || theme).palette.text.primary, 0.7),
}));

const PivotEmptyHeading = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: '0.9375rem',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.01em',
  color: (theme.vars || theme).palette.text.primary,
}));

const PIVOT_GRID_PROPS = {
  // Data Studio owns chrome elsewhere; the pivot view only shows the grid plus
  // its built-in pivot side panel.
  hideFooter: true,
  showToolbar: false,
  // `lazyLoading` must stay off so DataGridPremium keeps the Data Source
  // grouping / aggregation / pivoting strategy (matches the inline grid).
  lazyLoading: false,
  aggregationFunctions: DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
  pivotingColDef: getDataStudioPivotingColDef,
} as const;

export interface PivotViewParams {
  /**
   * The pivot configuration (rows / columns / values) persisted on the Sheet.
   * Falls back to an empty model when absent; the user fills it from the pivot
   * side panel.
   */
  pivotModel?: GridPivotModel;
}

/**
 * Renders the bound Data Source in DataGridPremium's pivot mode. The pivot
 * configuration is the Sheet's `params.pivotModel`, persisted on every change;
 * the same server-side aggregation / pivoting config the inline grid uses is
 * applied so a pivot Sheet behaves like the preview grid switched to pivot.
 */
function PivotView(props: DataStudioViewRenderProps<PivotViewParams>) {
  const { dataSource, params, setParams, apiRef } = props;
  const [pivotPanelOpen, setPivotPanelOpen] = React.useState(true);

  const pivotModel = params.pivotModel ?? EMPTY_PIVOT_MODEL;

  const handlePivotModelChange = React.useCallback(
    (next: GridPivotModel) => {
      setParams({ pivotModel: next });
    },
    [setParams],
  );

  // A pivot needs a Data Source to summarize. Sheets created from a Data
  // Source's preview (or the Composer with an active source) arrive bound;
  // an unbound pivot shows guidance instead of an empty grid.
  if (!dataSource) {
    return (
      <PivotEmpty>
        <PivotEmptyHeading>No Data Source connected</PivotEmptyHeading>
        <div>Create a pivot from a Data Source&apos;s preview to summarize its rows.</div>
      </PivotEmpty>
    );
  }

  return (
    <PivotRoot>
      <DataGridPremium
        {...PIVOT_GRID_PROPS}
        // Share DataStudio's apiRef so the menu bar / toolbar act on the pivot
        // (File → Download exports the pivoted data).
        apiRef={apiRef as any}
        columns={dataSource.columns}
        rows={dataSource.rows ?? []}
        getRowId={dataSource.getRowId}
        dataSource={dataSource.connector}
        dataSourceCache={dataSource.cache ?? undefined}
        dataSourceRevalidateMs={dataSource.dataSourceRevalidateMs}
        onDataSourceError={dataSource.onDataSourceError}
        pivotActive
        pivotModel={pivotModel}
        onPivotModelChange={handlePivotModelChange}
        pivotPanelOpen={pivotPanelOpen}
        onPivotPanelOpenChange={setPivotPanelOpen}
      />
    </PivotRoot>
  );
}

/**
 * Built-in `'pivot'` view type — a DataGridPremium pivot table over a Sheet's
 * bound Data Source. Premium-only; registered by default on `plan="premium"`
 * (see `getBuiltinViewTypes`). Pair with `pivotTemplate` to wire the Composer
 * card and the Data Source preview's "Pivot table" action.
 */
export const pivotViewType: DataStudioViewType<PivotViewParams> = {
  type: 'pivot',
  // Renders its grid on the shared apiRef, so the menu bar / toolbar act on it.
  gridBacked: true,
  defaultLabel: 'Pivot table',
  paramsSchema: {
    type: 'object',
    properties: {
      pivotModel: {
        type: 'object',
        description:
          'GridPivotModel: { rows: [{field}], columns: [{field}], values: [{field, aggFunc}] }.',
        properties: {
          rows: { type: 'array' },
          columns: { type: 'array' },
          values: { type: 'array' },
        },
      },
    },
  },
  Component: PivotView,
};
