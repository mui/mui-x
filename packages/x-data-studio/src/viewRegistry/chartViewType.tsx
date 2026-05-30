'use client';
import * as React from 'react';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  GridSidebarValue,
  type GridColDef,
  type GridInitialState,
} from '@mui/x-data-grid-premium';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium/ChartsRenderer';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '../internals/zero-styled';
import {
  DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
  DATA_STUDIO_PIVOT_MEASURE_CELL_CLASS,
  DATA_STUDIO_PIVOT_MEASURE_HEADER_CLASS,
} from '../DataStudio/gridDefaults';
import { pickBestDimension, pickMeasureColumns } from './columnHeuristics';
import type { DataStudioViewRenderProps, DataStudioViewType } from './types';

const CHART_ID = 'main';

const ChartViewRoot = styled('div')({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

// The grid (with the Charts config panel in its sidebar) takes the top portion;
// the chart canvas fills the rest below it. Both are normal-flow flex children —
// no absolute positioning / magic offsets — so the chart always lines up.
const ChartGridRegion = styled('div')({
  flex: 3,
  minHeight: 320,
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

const ChartCanvasRegion = styled('div')(({ theme }) => ({
  flex: 2,
  minHeight: 300,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
  // Align the canvas left edge to the grid rail; let the chart's own axis margin
  // carry the left gutter rather than stacking a 16px pad on top of it.
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.alpha((theme.vars || theme).palette.text.primary, 0.16)}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const ChartEmpty = styled('div')(({ theme }) => ({
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

const ChartEmptyHeading = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: '0.9375rem',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.01em',
  color: (theme.vars || theme).palette.text.primary,
}));

export interface ChartViewParams {
  /**
   * The grid charts-integration state (active chart + per-chart type, dimensions,
   * values, and configuration) persisted on the Sheet. Seeded back into the
   * grid's `initialState.chartsIntegration` on mount so a chart survives reloads.
   */
  chartsIntegration?: GridInitialState['chartsIntegration'];
}

/**
 * Pick sensible default chart fields from a Data Source's columns: a numeric
 * column as the measured value and the best categorical column as the grouping
 * dimension (see `columnHeuristics` — id/date columns are excluded and the
 * lowest-cardinality categorical wins when row data is available).
 */
function pickDefaultChartFields(
  columns: readonly GridColDef[],
  idField: string,
  rows: ReadonlyArray<Record<string, unknown>> | undefined,
): { dimension: string | null; value: string | null } {
  return {
    dimension: pickBestDimension(columns, idField, rows),
    value: pickMeasureColumns(columns, idField)[0]?.field ?? null,
  };
}

function fieldsOf(items: ReadonlyArray<string | { field: string }> | undefined): string[] {
  return (items ?? []).map((item) => (typeof item === 'string' ? item : item.field));
}

/**
 * Theme-derived visual overrides applied to every chart the renderer produces:
 * a softened, theme-tracked fill (never a literal hex, so dark mode stays
 * honest), a 1px stroke for edge definition, rounded bar tops, a deliberate
 * category gap, quiet tabular axis ticks, and a reduced-motion contract.
 */
interface ChartThemeOverrides {
  fill: string;
  stroke: string;
  borderRadius: number;
  categoryGapRatio: number;
  skipAnimation: boolean;
  tickLabelStyle: Record<string, any>;
}

/**
 * Adapts the chart axis when the underlying grid is row-grouped: the grouped
 * category axis arrives as nested group arrays, so each group level needs a
 * `getValue` that extracts its label. Without this the bars don't map to
 * categories and the chart renders empty axes. No-op for non-grouped charts
 * (`groups` is undefined). Mirrors the Data Grid charts-integration row-grouping
 * pattern. Also layers the theme-derived visual polish (`overrides`) onto every
 * chart type so the canvas matches the app chrome instead of the library default.
 */
function renderGroupedChart(
  type: string,
  chartProps: Record<string, any>,
  Component: React.ComponentType<any>,
  overrides: ChartThemeOverrides,
): React.ReactElement {
  const { fill, stroke, borderRadius, categoryGapRatio, skipAnimation, tickLabelStyle } = overrides;
  const styleAxes = (axes: any) =>
    Array.isArray(axes)
      ? axes.map((axis: Record<string, any>) => ({ tickLabelStyle, ...axis }))
      : axes;

  const themed: Record<string, any> = {
    ...chartProps,
    skipAnimation,
  };

  if (type === 'pie') {
    // A pie needs a categorical palette across its slices; keep the renderer's
    // palette but still honor the reduced-motion contract.
    return <Component {...themed} />;
  }

  // Single-measure cartesian charts: a softened, theme-tracked single fill so the
  // data reads instead of the pigment (resolved via theme.alpha, never a hex).
  themed.colors = [fill];
  if (type === 'bar' || type === 'column') {
    themed.borderRadius = borderRadius;
    themed.sx = {
      ...(chartProps.sx as object),
      '& .MuiBarElement-root': { stroke, strokeWidth: 1 },
    };
  }
  // Style axis tick text (quiet, tabular) on whichever axes the chart declares.
  themed.xAxis = styleAxes(themed.xAxis);
  themed.yAxis = styleAxes(themed.yAxis);

  // The category axis is `yAxis` for horizontal bars, `xAxis` otherwise.
  const axisKey = type === 'bar' ? 'yAxis' : 'xAxis';
  const isBarLike = type === 'bar' || type === 'column';
  const axes = themed[axisKey];
  if (!Array.isArray(axes)) {
    return <Component {...themed} />;
  }
  const adjusted = {
    ...themed,
    [axisKey]: axes.map((axis: Record<string, any>) => ({
      ...axis,
      // Deliberate negative space between bars so they read as discrete values.
      ...(isBarLike ? { categoryGapRatio } : {}),
      groups: axis.groups?.map((group: { getValue?: (value: any) => string }, index: number) => ({
        ...group,
        getValue: (value: string[]) => {
          const targetIndex = axis.groups.length - 1 - index;
          return targetIndex === 0 ? value[0] : value[targetIndex][0];
        },
      })),
    })),
  };
  return <Component {...adjusted} />;
}

function ChartView(props: DataStudioViewRenderProps<ChartViewParams>) {
  const { dataSource, params, setParams, apiRef } = props;
  const theme = useTheme();
  // Honor the OS reduced-motion preference: suppress the bar-grow animation for
  // motion-sensitive users (WCAG 2.3.3).
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
    defaultMatches: false,
  });

  // Theme-derived visual polish for the canvas: a softened, theme-tracked fill
  // (resolved through `theme.alpha` so dark mode desaturates instead of glowing),
  // a 1px stroke, rounded bar tops, a deliberate category gap, and quiet tabular
  // axis ticks. Memoized so the renderer callback stays stable.
  const chartOverrides = React.useMemo<ChartThemeOverrides>(() => {
    const primaryMain = (theme.vars || theme).palette.primary.main;
    return {
      fill: theme.alpha(primaryMain, 0.82),
      stroke: primaryMain,
      borderRadius: 4,
      categoryGapRatio: 0.4,
      skipAnimation: prefersReducedMotion,
      tickLabelStyle: {
        fontSize: 11,
        fill: (theme.vars || theme).palette.text.secondary,
        fontVariantNumeric: 'tabular-nums',
      },
    };
  }, [theme, prefersReducedMotion]);

  const handleRender = React.useCallback(
    (type: string, chartProps: Record<string, any>, Component: React.ComponentType<any>) =>
      renderGroupedChart(type, chartProps, Component, chartOverrides),
    [chartOverrides],
  );

  // `onStateChange` records the latest charts-integration snapshot into a ref
  // (render-safe), flushed to the Sheet's params on unmount — persists the chart
  // without churning state on every event. The grouping/aggregation sync (below)
  // is what makes charts aggregate by category instead of plotting raw rows.
  const latestChartsIntegrationRef = React.useRef<ChartViewParams['chartsIntegration'] | null>(
    null,
  );
  const setParamsRef = React.useRef(setParams);
  setParamsRef.current = setParams;
  const lastGroupingSignatureRef = React.useRef('');

  // Auto-aggregation (group the chart's dimension + sum its value) runs when we
  // know grouping is safe: either local row data is available (client-side
  // sources) OR the Data Source declares `chartDefaults` (the server vouches it
  // can group by those fields). Otherwise we don't force a (possibly
  // unsupported) server grouping; the user configures it via the panel.
  const hasChartDefaults =
    (dataSource?.chartDefaults?.dimensions?.length ?? 0) > 0 ||
    (dataSource?.chartDefaults?.values?.length ?? 0) > 0;
  const canAutoAggregate =
    (Array.isArray(dataSource?.rows) && dataSource.rows.length > 0) || hasChartDefaults;

  // Captured once for the grid's lifetime — `initialState` is read on mount only.
  const initialState = React.useRef<GridInitialState | undefined>(undefined);
  if (initialState.current === undefined && dataSource) {
    const seeded =
      params.chartsIntegration ??
      (() => {
        // Prefer the Data Source's declared chart defaults; otherwise infer a
        // dimension + value from the columns.
        const declared = dataSource.chartDefaults;
        const idField = dataSource.rowIdField ?? 'id';
        const inferred = pickDefaultChartFields(
          dataSource.columns,
          idField,
          dataSource.rows as ReadonlyArray<Record<string, unknown>> | undefined,
        );
        let dimensions: string[] = [];
        if (declared?.dimensions?.length) {
          dimensions = declared.dimensions;
        } else if (inferred.dimension) {
          dimensions = [inferred.dimension];
        }
        let values: string[] = [];
        if (declared?.values?.length) {
          values = declared.values;
        } else if (inferred.value) {
          values = [inferred.value];
        }
        return {
          charts: {
            [CHART_ID]: {
              chartType: 'column' as const,
              ...(dimensions.length ? { dimensions } : {}),
              ...(values.length ? { values } : {}),
            },
          },
        };
      })();
    const main = (seeded as GridInitialState['chartsIntegration'])?.charts?.[CHART_ID];
    const dims = fieldsOf(main?.dimensions as any);
    const vals = fieldsOf(main?.values as any);
    initialState.current = {
      sidebar: { open: true, value: GridSidebarValue.Charts },
      chartsIntegration: seeded as GridInitialState['chartsIntegration'],
      ...(canAutoAggregate && dims.length
        ? {
            rowGrouping: { model: dims },
            // Keep the grouped source columns hidden (like
            // `useKeepGroupedColumnsHidden`) so the grid shows a single group
            // column and the charts integration reads the grouped tree cleanly.
            columns: { columnVisibilityModel: Object.fromEntries(dims.map((f) => [f, false])) },
          }
        : {}),
      ...(canAutoAggregate && vals.length
        ? { aggregation: { model: Object.fromEntries(vals.map((f) => [f, 'sum'])) } }
        : {}),
    };
  }

  const handleStateChange = React.useCallback(() => {
    const api = apiRef.current;
    if (!api) {
      return;
    }
    const exported = api.exportState?.()?.chartsIntegration;
    if (exported) {
      latestChartsIntegrationRef.current = exported;
    }
    // Pivoting for charts: mirror the chart's dimensions → row grouping and its
    // values → aggregation (sum), so the chart visualizes grouped/aggregated
    // data. Guarded by a signature so it only runs when the field mapping
    // changes, and deferred so we never re-enter the grid mid-update. Only for
    // client-side sources (see `canAutoAggregate`) — server grouping is the
    // connector's responsibility and may not support arbitrary fields.
    if (!canAutoAggregate || typeof api.setRowGroupingModel !== 'function') {
      return;
    }
    const charts = (api.state as any)?.chartsIntegration?.charts?.[CHART_ID];
    const dimensions = fieldsOf(charts?.dimensions);
    const values = fieldsOf(charts?.values);
    const signature = JSON.stringify({ dimensions, values });
    if (signature === lastGroupingSignatureRef.current) {
      return;
    }
    lastGroupingSignatureRef.current = signature;
    queueMicrotask(() => {
      const current = apiRef.current;
      if (!current || typeof current.setRowGroupingModel !== 'function') {
        return;
      }
      const currentGrouping = (current.state as any)?.rowGrouping?.model ?? [];
      if (JSON.stringify(currentGrouping) !== JSON.stringify(dimensions)) {
        current.setRowGroupingModel(dimensions);
      }
      const currentAggregation = (current.state as any)?.aggregation?.model ?? {};
      const nextAggregation: Record<string, string> = {};
      for (const field of values) {
        nextAggregation[field] = currentAggregation[field] ?? 'sum';
      }
      if (JSON.stringify(currentAggregation) !== JSON.stringify(nextAggregation)) {
        current.setAggregationModel(nextAggregation);
      }
    });
  }, [apiRef, canAutoAggregate]);

  React.useEffect(
    () => () => {
      const latest = latestChartsIntegrationRef.current;
      if (latest) {
        setParamsRef.current({ chartsIntegration: latest });
      }
    },
    [],
  );

  if (!dataSource) {
    return (
      <ChartEmpty>
        <ChartEmptyHeading>No Data Source connected</ChartEmptyHeading>
        <div>Create a chart from a Data Source&apos;s preview to visualize its rows.</div>
      </ChartEmpty>
    );
  }

  // Accessible name for the canvas: a screen-reader user landing on the chart
  // region hears what it plots (the grouped grid above is the data-table
  // alternative). WCAG 1.1.1 / 4.1.2.
  const labelOf = (field: string) =>
    dataSource.columns.find((column) => column.field === field)?.headerName ?? field;
  const seededMain = (initialState.current as GridInitialState | undefined)?.chartsIntegration
    ?.charts?.[CHART_ID];
  const seededDims = fieldsOf(seededMain?.dimensions as any);
  const seededVals = fieldsOf(seededMain?.values as any);
  const chartAriaLabel =
    seededVals.length && seededDims.length
      ? `Chart of ${seededVals.map(labelOf).join(', ')} by ${seededDims.map(labelOf).join(', ')}`
      : 'Chart of the connected Data Source';

  return (
    <GridChartsIntegrationContextProvider>
      <ChartViewRoot>
        <ChartGridRegion>
          <DataGridPremium
            key={dataSource.id}
            apiRef={apiRef as any}
            columns={dataSource.columns}
            rows={dataSource.rows ?? []}
            getRowId={dataSource.getRowId}
            dataSource={dataSource.connector}
            dataSourceCache={dataSource.cache ?? undefined}
            dataSourceRevalidateMs={dataSource.dataSourceRevalidateMs}
            onDataSourceError={dataSource.onDataSourceError}
            chartsIntegration
            showToolbar
            density="compact"
            hideFooter
            lazyLoading={false}
            // Server-side aggregation descriptors only apply to connector-backed
            // sources (the connector computes the values). For client-side rows,
            // omit them so the grid keeps its built-in `sum`/`avg`/... functions
            // — passing the empty server descriptors would override `sum` with a
            // no-op and the chart would have nothing to plot.
            {...(dataSource.connector
              ? { aggregationFunctions: DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS }
              : {})}
            onStateChange={handleStateChange}
            slots={{ chartsPanel: GridChartsPanel }}
            slotProps={{ chartsPanel: { schema: configurationOptions } as any }}
            initialState={initialState.current}
          />
        </ChartGridRegion>
        <ChartCanvasRegion role="img" aria-label={chartAriaLabel}>
          <GridChartsRendererProxy
            id={CHART_ID}
            renderer={ChartsRenderer}
            onRender={handleRender}
          />
        </ChartCanvasRegion>
      </ChartViewRoot>
    </GridChartsIntegrationContextProvider>
  );
}

/**
 * Built-in `'chart'` view type — a DataGridPremium charts-integration workspace
 * over a Sheet's bound Data Source. The grid (with the chart config panel in its
 * sidebar) sits above a live `ChartsRenderer` canvas. Chart dimensions/values are
 * mirrored to row grouping + aggregation so charts summarize by category.
 * Premium-only; registered by default on `plan="premium"`.
 */
export const chartViewType: DataStudioViewType<ChartViewParams> = {
  type: 'chart',
  // Renders its grid on the shared apiRef, so the menu bar / toolbar act on it.
  gridBacked: true,
  defaultLabel: 'Chart',
  paramsSchema: {
    type: 'object',
    properties: {
      chartsIntegration: {
        type: 'object',
        description:
          'Grid charts-integration state: { activeChartId, charts: { [id]: { chartType, dimensions, values } } }.',
      },
    },
  },
  Component: ChartView,
};
