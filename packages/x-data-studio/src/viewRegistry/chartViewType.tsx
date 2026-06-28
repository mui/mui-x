'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createSvgIcon } from '@mui/material/utils';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  DataGridPremium,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  type GridColDef,
  type GridInitialState,
} from '@mui/x-data-grid-premium';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import { styled } from '../internals/zero-styled';
import {
  DATA_STUDIO_PIVOT_MEASURE_CELL_CLASS,
  DATA_STUDIO_PIVOT_MEASURE_HEADER_CLASS,
  DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
} from '../DataStudio/gridDefaults';
import {
  isDateLikeColumn,
  isIdLikeColumn,
  pickBestDimension,
  pickDimensionColumns,
  pickMeasureColumns,
} from './columnHeuristics';
import {
  DATE_GRANULARITIES,
  DEFAULT_NUMERIC_BINS,
  NUMERIC_BIN_OPTIONS,
  dateBucket,
  numericBucket,
  numericExtent,
  type DateGranularity,
} from './binning';
import type { DataStudioBinDirective } from '../models';
import type { DataStudioViewRenderProps, DataStudioViewType } from './types';

const CHART_ID = 'main';
// Rows sampled from a server connector so a connector-backed source can still be
// charted (grouped/aggregated) client-side. Sample-based values are approximate.
const SERVER_SAMPLE_SIZE = 500;
// Default a numeric group to "infinite" bins (exact values) up to this many
// distinct values; beyond it, bracket into a finite histogram instead.
const INFINITE_BIN_THRESHOLD = 100;

const EMPTY_ROWS: ReadonlyArray<Record<string, unknown>> = [];
const EMPTY_COLUMNS: readonly GridColDef[] = [];

type ChartKind = 'column' | 'bar' | 'line' | 'area' | 'pie';
type MetricAgg = 'count' | 'sum' | 'avg' | 'min' | 'max';

interface ChartMetric {
  /** `count` = Count of rows; otherwise an aggregate of `field`. */
  agg: MetricAgg;
  field: string | null;
}

interface ChartSummary {
  /** One or more metrics → one chart series each (Metabase-style multi-series). */
  metrics: ChartMetric[];
  groupBy: string | null;
  chartType: ChartKind;
  /** Bucket size when `groupBy` is a date-like column (Metabase-style date binning). */
  dateBin?: DateGranularity;
  /**
   * Bracket count when `groupBy` is a numeric column, or `'infinite'` to group by
   * each exact value (no bucketing). Defaults to `'infinite'` while the column has
   * ≤ 100 distinct values, else a finite bracket count.
   */
  numericBins?: number | 'infinite';
}

export interface ChartViewParams {
  /**
   * The Metabase-style summary that drives the chart: a metric (Count of rows or
   * an aggregate of a column) grouped by a dimension, plus the chart type.
   * Persisted on the Sheet's params so the chart survives reloads.
   */
  summary?: ChartSummary;
}

const ColumnChartIcon = createSvgIcon(
  <path d="M4 12h4v8H4zm6-6h4v14h-4zm6 3h4v11h-4z" />,
  'ColumnChart',
);
const BarChartIcon = createSvgIcon(<path d="M4 5h10v3H4zm0 5.5h14v3H4zm0 5.5h7v3H4z" />, 'BarChart');
const LineChartIcon = createSvgIcon(
  <path
    d="M3.5 16.5l5-5 4 3 7.5-8.5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />,
  'LineChart',
);
const AreaChartIcon = createSvgIcon(<path d="M3 20v-7l5-4 4 2 7-6v15z" />, 'AreaChart');
const PieChartIcon = createSvgIcon(
  <path d="M13 2.05V11h8.95A9 9 0 0 0 13 2.05zM11 4.05A9 9 0 1 0 19.95 13H11z" />,
  'PieChart',
);
const CloseIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'Close',
);

const CHART_TYPES: ReadonlyArray<{ value: ChartKind; label: string; Icon: typeof ColumnChartIcon }> =
  [
    { value: 'column', label: 'Column', Icon: ColumnChartIcon },
    { value: 'bar', label: 'Bar', Icon: BarChartIcon },
    { value: 'line', label: 'Line', Icon: LineChartIcon },
    { value: 'area', label: 'Area', Icon: AreaChartIcon },
    { value: 'pie', label: 'Pie', Icon: PieChartIcon },
  ];

const METRIC_AGGS: ReadonlyArray<{ value: MetricAgg; label: string }> = [
  { value: 'count', label: 'Count of rows' },
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
];

const AGG_LABEL: Record<MetricAgg, string> = {
  count: 'Count of rows',
  sum: 'Sum',
  avg: 'Average',
  min: 'Minimum',
  max: 'Maximum',
};

const ChartViewRoot = styled('div')({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const ChartTopBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.5),
  minHeight: 44,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ModeToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    textTransform: 'none',
    fontSize: '0.8125rem',
    fontWeight: 500,
    lineHeight: 1,
    padding: theme.spacing(0.5, 1.5),
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const ChartBody = styled('div')({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
});

// The chart canvas and the data grid are stacked in the same box; the mode toggle
// flips `visibility` between them. The grid stays mounted and full-sized always so
// its grouping/aggregation state — which feeds the chart — keeps computing even
// when it's hidden behind the chart.
const ChartCanvasArea = styled('div')({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
});

const StackedLayer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  visibility: active ? 'visible' : 'hidden',
  pointerEvents: active ? 'auto' : 'none',
}));

// The chart layer is fully removed from layout when inactive (`display: none`) —
// the charts library re-asserts `visibility: visible` on its own elements, so a
// hidden-via-visibility chart would still paint over the grid. The chart needs no
// background computation, so dropping it from the tree is safe.
const ChartLayer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  inset: 0,
  display: active ? 'flex' : 'none',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
}));

const GridLayer = styled(StackedLayer)({
  // Keep the generated aggregation header on a single line, and use tabular
  // figures so aggregated values align in one optical column.
  [`& .${DATA_STUDIO_PIVOT_MEASURE_HEADER_CLASS} .MuiDataGrid-columnHeaderTitle`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  [`& .${DATA_STUDIO_PIVOT_MEASURE_CELL_CLASS}`]: {
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
  },
});

const ChartCanvas = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const ConfigPanel = styled('div')(({ theme }) => ({
  width: 264,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  padding: theme.spacing(2),
  overflowY: 'auto',
  borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const PanelSection = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const PanelSectionTitle = styled('div')(({ theme }) => ({
  textTransform: 'uppercase',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  color: (theme.vars || theme).palette.text.secondary,
}));

const VizTypeGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(1),
}));

const VizTypeTile = styled('button', {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  appearance: 'none',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 0.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    selected
      ? (theme.vars || theme).palette.primary.main
      : (theme.vars || theme).palette.divider
  }`,
  backgroundColor: selected
    ? theme.alpha((theme.vars || theme).palette.primary.main, 0.08)
    : 'transparent',
  color: selected
    ? (theme.vars || theme).palette.primary.main
    : (theme.vars || theme).palette.text.secondary,
  fontSize: '0.6875rem',
  fontWeight: selected ? 600 : 500,
  transition: theme.transitions.create(['background-color', 'border-color', 'color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: selected
      ? theme.alpha((theme.vars || theme).palette.primary.main, 0.12)
      : theme.alpha((theme.vars || theme).palette.text.primary, 0.04),
    borderColor: selected
      ? (theme.vars || theme).palette.primary.main
      : theme.alpha((theme.vars || theme).palette.text.primary, 0.23),
  },
  '& svg': { fontSize: '1.25rem' },
}));

const FieldGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

const FieldLabel = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: (theme.vars || theme).palette.text.primary,
}));

const MetricRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const MetricFields = styled('div')(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const RemoveMetricButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
  color: (theme.vars || theme).palette.text.secondary,
  '& svg': { fontSize: '1.125rem' },
  '&:hover': { color: (theme.vars || theme).palette.text.primary },
}));

const AddMetricButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  textTransform: 'none',
  fontSize: '0.75rem',
  fontWeight: 500,
  padding: theme.spacing(0.25, 0.5),
  minWidth: 0,
}));

const PanelSelect = styled(Select)(({ theme }) => ({
  fontSize: '0.8125rem',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.04),
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.08),
  },
  '& .MuiSelect-select': { padding: theme.spacing(0.75, 4, 0.75, 1.25) },
}));

const SampleNote = styled('div')(({ theme }) => ({
  fontSize: '0.6875rem',
  lineHeight: 1.5,
  color: (theme.vars || theme).palette.text.secondary,
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

interface SampleState {
  status: 'idle' | 'loading' | 'error';
  rows: ReadonlyArray<Record<string, unknown>> | null;
}

function buildDefaultSummary(
  columns: readonly GridColDef[],
  idField: string,
  rows: ReadonlyArray<Record<string, unknown>> | undefined,
  declared: { dimensions?: string[]; values?: string[] } | undefined,
): ChartSummary {
  const measures = pickMeasureColumns(columns, idField);
  const groupBy =
    declared?.dimensions?.[0] ??
    pickBestDimension(columns, idField, rows) ??
    pickDimensionColumns(columns, idField)[0]?.field ??
    null;
  const metricField = declared?.values?.[0] ?? measures[0]?.field ?? null;
  const metric: ChartMetric = metricField
    ? { agg: 'sum', field: metricField }
    : { agg: 'count', field: null };
  const groupColumn = columns.find((column) => column.field === groupBy);
  const chartType: ChartKind = groupColumn && isDateLikeColumn(groupColumn) ? 'line' : 'column';
  // `numericBins` is intentionally left unset so the view can default it
  // dynamically (infinite while ≤ 100 distinct values, else a finite count).
  return {
    metrics: [metric],
    groupBy,
    chartType,
    dateBin: 'month',
  };
}

/**
 * Accept the current summary shape, migrate the older single-metric shape
 * (`{ metricAgg, metricField }`), or fall back to the computed default.
 */
function normalizeSummary(raw: unknown, fallback: ChartSummary): ChartSummary {
  const value = raw as Partial<ChartSummary> & { metricAgg?: MetricAgg; metricField?: string | null };
  if (value && Array.isArray(value.metrics) && value.metrics.length > 0) {
    return {
      metrics: value.metrics,
      groupBy: value.groupBy ?? null,
      chartType: value.chartType ?? 'column',
      dateBin: value.dateBin,
      numericBins: value.numericBins,
    };
  }
  if (value && value.metricAgg) {
    return {
      metrics: [{ agg: value.metricAgg, field: value.metricField ?? null }],
      groupBy: value.groupBy ?? null,
      chartType: value.chartType ?? 'column',
      dateBin: value.dateBin,
      numericBins: value.numericBins,
    };
  }
  return fallback;
}

/**
 * Theme-derived visual overrides applied to every chart the renderer produces: a
 * softened, theme-tracked fill (never a literal hex, so dark mode stays honest),
 * a 1px stroke, rounded bar tops, a deliberate category gap, quiet tabular axis
 * ticks, and a reduced-motion contract.
 */
interface ChartThemeOverrides {
  /** Series palette (softened theme colors) — one per metric series. */
  colors: string[];
  stroke: string;
  borderRadius: number;
  categoryGapRatio: number;
  skipAnimation: boolean;
  tickLabelStyle: Record<string, any>;
}

/**
 * Adapts the chart axis when the underlying grid is row-grouped (the grouped
 * category axis arrives as nested group arrays), and layers the theme-derived
 * visual polish onto every chart type so the canvas matches the app chrome.
 */
function renderGroupedChart(
  type: string,
  chartProps: Record<string, any>,
  Component: React.ComponentType<any>,
  overrides: ChartThemeOverrides,
): React.ReactElement {
  const { colors, stroke, borderRadius, categoryGapRatio, skipAnimation, tickLabelStyle } =
    overrides;
  const styleAxes = (axes: any) =>
    Array.isArray(axes)
      ? axes.map((axis: Record<string, any>) => ({ tickLabelStyle, ...axis }))
      : axes;

  const themed: Record<string, any> = { ...chartProps, skipAnimation };

  if (type === 'pie') {
    return <Component {...themed} />;
  }

  themed.colors = colors;
  if (type === 'bar' || type === 'column') {
    themed.borderRadius = borderRadius;
    themed.sx = {
      ...(chartProps.sx as object),
      '& .MuiBarElement-root': { stroke, strokeWidth: 1 },
    };
  }
  themed.xAxis = styleAxes(themed.xAxis);
  themed.yAxis = styleAxes(themed.yAxis);

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
  const { dataSource, dataSources, onChangeDataSource, params, setParams, apiRef } = props;
  const theme = useTheme();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
    defaultMatches: false,
  });
  const [mode, setMode] = React.useState<'chart' | 'data'>('chart');

  // Engine:
  //  - client sources → group/aggregate their local rows (incl. binning);
  //  - server sources that group server-side → push grouping/aggregation to the
  //    connector over the WHOLE dataset (no sampling);
  //  - server sources that need client-only binning (finite numeric bins) or that
  //    don't support server grouping → sample up to 500 rows and group client-side.
  const hasLocalRows = (dataSource?.rows?.length ?? 0) > 0;
  const serverGroupingCapable =
    !hasLocalRows && Boolean(dataSource?.connector) && dataSource?.supportsServerGrouping === true;
  const [sample, setSample] = React.useState<SampleState>({ status: 'idle', rows: null });

  const rows = React.useMemo<ReadonlyArray<Record<string, unknown>>>(
    () =>
      hasLocalRows
        ? ((dataSource!.rows ?? EMPTY_ROWS) as ReadonlyArray<Record<string, unknown>>)
        : (sample.rows ?? EMPTY_ROWS),
    [hasLocalRows, dataSource, sample.rows],
  );
  const columns = React.useMemo<readonly GridColDef[]>(
    () => dataSource?.columns ?? EMPTY_COLUMNS,
    [dataSource],
  );
  const idField = dataSource?.rowIdField ?? 'id';
  const sampled = !hasLocalRows && sample.rows != null && rows.length > 0;

  const measures = React.useMemo(() => pickMeasureColumns(columns, idField), [columns, idField]);
  const dimensions = React.useMemo(
    () => pickDimensionColumns(columns, idField),
    [columns, idField],
  );
  // Date-like columns are excluded from `pickDimensionColumns`, but they are valid
  // (and primary) grouping dimensions for a chart — grouped via date binning. Offer
  // them in Group by after the plain categoricals.
  const dateColumns = React.useMemo(
    () =>
      columns.filter(
        (column) =>
          column.field !== idField &&
          column.type !== 'number' &&
          isDateLikeColumn(column) &&
          !isIdLikeColumn(column),
      ),
    [columns, idField],
  );
  // Numeric columns can also be grouped — into equal-width brackets (a histogram).
  const numericColumns = React.useMemo(
    () =>
      columns.filter(
        (column) =>
          column.field !== idField && column.type === 'number' && !isIdLikeColumn(column),
      ),
    [columns, idField],
  );
  const groupByColumns = React.useMemo(
    () => [...dimensions, ...dateColumns, ...numericColumns],
    [dimensions, dateColumns, numericColumns],
  );

  const defaultSummary = React.useMemo(
    () => buildDefaultSummary(columns, idField, rows, dataSource?.chartDefaults),
    [columns, idField, rows, dataSource],
  );
  const summary = React.useMemo(
    () => normalizeSummary(params.summary, defaultSummary),
    [params.summary, defaultSummary],
  );
  const commitSummary = React.useCallback(
    (patch: Partial<ChartSummary>) => {
      setParams({ summary: { ...summary, ...patch } });
    },
    [setParams, summary],
  );
  const updateMetric = React.useCallback(
    (index: number, patch: Partial<ChartMetric>) => {
      commitSummary({
        metrics: summary.metrics.map((metric, i) => (i === index ? { ...metric, ...patch } : metric)),
      });
    },
    [commitSummary, summary.metrics],
  );
  const removeMetric = React.useCallback(
    (index: number) => {
      commitSummary({ metrics: summary.metrics.filter((_, i) => i !== index) });
    },
    [commitSummary, summary.metrics],
  );

  // The grid column aggregated for a "Count of rows" metric: prefer the id field
  // (when it's an actual column), else any column that isn't the grouping one.
  const countField = React.useMemo(() => {
    if (columns.some((column) => column.field === idField)) {
      return idField;
    }
    return columns.find((column) => column.field !== summary.groupBy)?.field ?? null;
  }, [columns, idField, summary.groupBy]);

  // Resolve each metric to a grid (field, aggregation). The grid's aggregation model
  // is keyed by field, so metrics are de-duped by field (one series per field) — e.g.
  // Sum of Units + Sum of Revenue gives two series; two aggregates of the same column
  // can't co-exist and the first wins.
  const { valueFields, aggregationModel } = React.useMemo(() => {
    const fields: string[] = [];
    const model: Record<string, string> = {};
    for (const metric of summary.metrics) {
      const field = metric.agg === 'count' ? countField : metric.field;
      const fn = metric.agg === 'count' ? 'size' : metric.agg;
      if (field && !(field in model)) {
        model[field] = fn;
        fields.push(field);
      }
    }
    return { valueFields: fields, aggregationModel: model };
  }, [summary.metrics, countField]);
  const hasCountMetric = summary.metrics.some((metric) => metric.agg === 'count');

  // The chosen Group by column, and which binning (if any) it needs.
  const groupColumn = React.useMemo(
    () => columns.find((column) => column.field === summary.groupBy),
    [columns, summary.groupBy],
  );
  const isDateGroup = Boolean(groupColumn && isDateLikeColumn(groupColumn));
  const isNumericGroup = Boolean(groupColumn && groupColumn.type === 'number' && !isDateGroup);
  const dateBin: DateGranularity = summary.dateBin ?? 'month';
  // Distinct values of a numeric group column (client data only) — used to pick the
  // default bin mode: "infinite" (group by exact value) reads cleanly only below a
  // distinct-count threshold.
  const numericDistinctCount = React.useMemo(() => {
    if (!isNumericGroup || !summary.groupBy) {
      return 0;
    }
    const field = summary.groupBy;
    const seen = new Set<number>();
    for (const row of rows) {
      const value = Number(row[field]);
      if (Number.isFinite(value)) {
        seen.add(value);
      }
    }
    return seen.size;
  }, [isNumericGroup, summary.groupBy, rows]);
  // Default bins: a server numeric group has no local rows to count, so it groups
  // exact ("infinite"); client data defaults to "infinite" while ≤ 100 distinct
  // values, else a finite bracket count.
  let numericBinsDefault: number | 'infinite' = DEFAULT_NUMERIC_BINS;
  if (isNumericGroup && serverGroupingCapable) {
    numericBinsDefault = 'infinite';
  } else if (numericDistinctCount > 0 && numericDistinctCount <= INFINITE_BIN_THRESHOLD) {
    numericBinsDefault = 'infinite';
  }
  const numericBins: number | 'infinite' = summary.numericBins ?? numericBinsDefault;
  // A numeric group is *bracketed* only when a finite bin count is chosen.
  const numericBinned = isNumericGroup && numericBins !== 'infinite';

  // Server grouping covers the WHOLE dataset for categorical, date (bucketed via
  // the connector), infinite-numeric (exact), and finite numeric (equal-width
  // brackets via the `numeric` bin directive — see `serverBinning` below).
  const useServerGrouping = serverGroupingCapable;
  // Only the local/sample path derives bin columns client-side; server date binning
  // is pushed down to the connector.
  const clientBinned = !useServerGrouping && (isDateGroup || numericBinned);
  // The field the grid groups on: the raw column under server grouping, else a
  // synthetic client bucket column for binned dates/numbers.
  let groupField: string | null = summary.groupBy ?? null;
  if (clientBinned && summary.groupBy) {
    groupField = `${summary.groupBy}__bin`;
  }

  // Sample a server source only on the fallback path (not when grouping server-side).
  const canSample = !hasLocalRows && Boolean(dataSource?.connector) && !useServerGrouping;
  React.useEffect(() => {
    const connector = dataSource?.connector;
    if (!canSample || !connector) {
      return undefined;
    }
    let cancelled = false;
    setSample({ status: 'loading', rows: null });
    Promise.resolve(
      connector.getRows({
        start: 0,
        end: SERVER_SAMPLE_SIZE - 1,
        sortModel: [],
        filterModel: { items: [] },
      } as Parameters<typeof connector.getRows>[0]),
    )
      .then((response) => {
        if (!cancelled) {
          setSample({
            status: 'idle',
            rows: (response?.rows ?? []) as ReadonlyArray<Record<string, unknown>>,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSample({ status: 'error', rows: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [canSample, dataSource]);

  // Server-side date binning: a directive + a connector wrapper that injects it into
  // every getRows call, so the backend groups by the bucket (e.g. month) on the full
  // dataset.
  const serverBinning = React.useMemo<Record<string, DataStudioBinDirective> | undefined>(() => {
    if (!useServerGrouping || !summary.groupBy) {
      return undefined;
    }
    if (isDateGroup) {
      return { [summary.groupBy]: { kind: 'date', granularity: dateBin } };
    }
    // Finite numeric binning: push equal-width brackets down to the connector so
    // the backend buckets the whole dataset. `infinite` numeric groups by the raw
    // value (no directive needed).
    if (numericBinned) {
      return { [summary.groupBy]: { kind: 'numeric', bins: numericBins as number } };
    }
    return undefined;
  }, [useServerGrouping, isDateGroup, numericBinned, numericBins, summary.groupBy, dateBin]);
  const gridConnector = React.useMemo(() => {
    const connector = dataSource?.connector;
    if (!useServerGrouping || !connector) {
      return undefined;
    }
    if (!serverBinning) {
      return connector;
    }
    return {
      ...connector,
      getRows: (requestParams: any) =>
        connector.getRows({ ...requestParams, binning: serverBinning }),
    };
  }, [useServerGrouping, dataSource, serverBinning]);

  // Min/max of the numeric group-by column over the local rows, for client histogram bracketing.
  const numericRange = React.useMemo(
    () => (numericBinned && summary.groupBy ? numericExtent(rows, summary.groupBy) : null),
    [numericBinned, summary.groupBy, rows],
  );

  const gridColumns = React.useMemo<readonly GridColDef[]>(() => {
    if (!clientBinned || !summary.groupBy || !groupField) {
      return columns;
    }
    return [
      ...columns,
      {
        field: groupField,
        headerName: groupColumn?.headerName ?? summary.groupBy,
        ...(numericBinned ? { type: 'number' as const } : {}),
      },
    ];
  }, [columns, clientBinned, numericBinned, summary.groupBy, groupField, groupColumn]);

  const gridRows = React.useMemo<ReadonlyArray<Record<string, unknown>>>(() => {
    if (!clientBinned || !summary.groupBy || !groupField) {
      return rows;
    }
    const field = summary.groupBy;
    if (isDateGroup) {
      return rows.map((row) => ({ ...row, [groupField]: dateBucket(row[field], dateBin) }));
    }
    if (!numericRange) {
      return rows;
    }
    const { min, max } = numericRange;
    // `numericRange` is only set when `numericBinned`, so `numericBins` is a number here.
    const bins = numericBins as number;
    return rows.map((row) => ({
      ...row,
      [groupField]: numericBucket(Number(row[field]), min, max, bins),
    }));
  }, [rows, clientBinned, isDateGroup, summary.groupBy, groupField, dateBin, numericRange, numericBins]);

  // Relabel the count value series to a clean "Count" (otherwise the grid would label
  // it `<id column> (size)`). The integration reads `slotProps.chartsPanel.getColumnName`
  // before composing the default label.
  const chartsSlotProps = React.useMemo(
    () =>
      ({
        chartsPanel: {
          getColumnName: (field: string) =>
            hasCountMetric && field === countField ? 'Count' : undefined,
        },
      }) as any,
    [hasCountMetric, countField],
  );

  // Theme-derived visual polish for the canvas (resolved through `theme.alpha` so
  // dark mode desaturates instead of glowing). Memoized so the renderer callback
  // stays stable.
  const chartOverrides = React.useMemo<ChartThemeOverrides>(() => {
    const palette = (theme.vars || theme).palette;
    // One softened hue per series; the first stays the brand primary so single-series
    // charts look unchanged.
    const colors = [
      palette.primary.main,
      palette.secondary.main,
      palette.success.main,
      palette.warning.main,
      palette.info.main,
      palette.error.main,
    ].map((color) => theme.alpha(color, 0.82));
    return {
      colors,
      stroke: palette.primary.main,
      borderRadius: 4,
      categoryGapRatio: 0.4,
      skipAnimation: prefersReducedMotion,
      tickLabelStyle: {
        fontSize: 11,
        fill: palette.text.secondary,
        fontVariantNumeric: 'tabular-nums',
      },
    };
  }, [theme, prefersReducedMotion]);

  const handleRender = React.useCallback(
    (type: string, chartProps: Record<string, any>, Component: React.ComponentType<any>) =>
      renderGroupedChart(type, chartProps, Component, chartOverrides),
    [chartOverrides],
  );

  // Seed the integration with the chart shell once; the effect below pushes the
  // live summary (grouping, aggregation, dimensions/values, type) imperatively.
  const initialState = React.useRef<GridInitialState | undefined>(undefined);
  if (initialState.current === undefined) {
    initialState.current = {
      chartsIntegration: { charts: { [CHART_ID]: { chartType: defaultSummary.chartType } } },
    };
  }

  // Push the summary into the grid: dimension → row grouping, metric → aggregation
  // (`size` for count), and the chart's dimensions/values/type. Re-runs when the
  // summary changes or sampled rows arrive.
  React.useEffect(() => {
    const api = apiRef.current as any;
    if (!api || !dataSource) {
      return;
    }
    api.setRowGroupingModel?.(groupField ? [groupField] : []);
    if (groupField) {
      // Hide the grouped (or derived bucket) column so the grid shows one group column.
      api.setColumnVisibility?.(groupField, false);
    }
    api.setAggregationModel?.(aggregationModel);
    api.updateChartDimensionsData?.(CHART_ID, groupField ? [{ field: groupField }] : []);
    api.updateChartValuesData?.(
      CHART_ID,
      valueFields.map((field) => ({ field })),
    );
    api.setChartType?.(CHART_ID, summary.chartType);
  }, [
    apiRef,
    dataSource,
    groupField,
    summary.chartType,
    valueFields,
    aggregationModel,
    dateBin,
    numericBins,
    rows.length,
  ]);

  if (!dataSource) {
    return (
      <ChartEmpty>
        <ChartEmptyHeading>No Data Source connected</ChartEmptyHeading>
        <div>Create a chart from a Data Source&apos;s preview to visualize its rows.</div>
      </ChartEmpty>
    );
  }

  const labelOf = (field: string | null) =>
    (field && columns.find((column) => column.field === field)?.headerName) || field || '';
  const metricLabel = (metric: ChartMetric) =>
    metric.agg === 'count'
      ? 'Count of rows'
      : `${AGG_LABEL[metric.agg]} of ${labelOf(metric.field)}`;
  const chartTypeLabel = CHART_TYPES.find((entry) => entry.value === summary.chartType)?.label ?? '';
  const chartAriaLabel = summary.groupBy
    ? `${chartTypeLabel} chart of ${summary.metrics.map(metricLabel).join(', ')} by ${labelOf(
        summary.groupBy,
      )}`
    : `${chartTypeLabel} chart`;

  // Server grouping streams data from the connector (no local rows), so it doesn't
  // gate on `rows.length`.
  const canChart =
    Boolean(summary.groupBy) && valueFields.length > 0 && (useServerGrouping || rows.length > 0);

  // Offer "Add metric" only while there is an unused numeric measure to add (each
  // metric series needs a distinct field — see the aggregation-model note above).
  const usedMetricFields = new Set(
    summary.metrics.filter((metric) => metric.agg !== 'count').map((metric) => metric.field),
  );
  const nextMeasure = measures.find((column) => !usedMetricFields.has(column.field));
  const handleAddMetric = () => {
    if (nextMeasure) {
      commitSummary({ metrics: [...summary.metrics, { agg: 'sum', field: nextMeasure.field }] });
    }
  };

  let chartLayerContent: React.ReactNode;
  if (!useServerGrouping && sample.status === 'loading' && rows.length === 0) {
    chartLayerContent = (
      <ChartEmpty>
        <div>Loading a sample of the Data Source…</div>
      </ChartEmpty>
    );
  } else if (!useServerGrouping && sample.status === 'error') {
    chartLayerContent = (
      <ChartEmpty>
        <ChartEmptyHeading>Sample request failed</ChartEmptyHeading>
        <div>The Data Source sample could not be loaded; try a Pivot instead.</div>
      </ChartEmpty>
    );
  } else if (!useServerGrouping && rows.length === 0) {
    chartLayerContent = (
      <ChartEmpty>
        <ChartEmptyHeading>No data to chart</ChartEmptyHeading>
        <div>This Data Source has no rows to visualize.</div>
      </ChartEmpty>
    );
  } else if (!canChart) {
    chartLayerContent = (
      <ChartEmpty>
        <ChartEmptyHeading>Build a chart</ChartEmptyHeading>
        <div>Pick a metric and a &quot;Group by&quot; column in the panel to chart this Data Source.</div>
      </ChartEmpty>
    );
  } else {
    chartLayerContent = (
      <ChartCanvas role="img" aria-label={chartAriaLabel}>
        <GridChartsRendererProxy id={CHART_ID} renderer={ChartsRenderer} onRender={handleRender} />
      </ChartCanvas>
    );
  }

  return (
    <GridChartsIntegrationContextProvider>
      <ChartViewRoot>
        <ChartTopBar>
          <ModeToggle
            size="small"
            exclusive
            value={mode}
            onChange={(_event, next) => {
              if (next) {
                setMode(next);
              }
            }}
            aria-label="Chart or data view"
          >
            <ToggleButton value="chart" aria-label="Show chart">
              Chart
            </ToggleButton>
            <ToggleButton value="data" aria-label="Show data table">
              Data
            </ToggleButton>
          </ModeToggle>
        </ChartTopBar>

        <ChartBody>
          <ChartCanvasArea>
            <GridLayer active={mode === 'data'}>
              <DataGridPremium
                key={dataSource.id}
                apiRef={apiRef as any}
                getRowId={dataSource.getRowId}
                chartsIntegration
                showToolbar
                density="compact"
                hideFooter
                lazyLoading={false}
                slotProps={chartsSlotProps}
                initialState={initialState.current}
                // Server grouping: push grouping/aggregation to the connector over the
                // whole dataset. Otherwise group the local/sampled rows client-side.
                {...(useServerGrouping
                  ? {
                      columns: dataSource.columns as any,
                      dataSource: gridConnector as any,
                      aggregationFunctions: DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS,
                    }
                  : { columns: gridColumns as any, rows: gridRows as any })}
              />
            </GridLayer>
            <ChartLayer active={mode === 'chart'}>{chartLayerContent}</ChartLayer>
          </ChartCanvasArea>

          <ConfigPanel>
            {onChangeDataSource && dataSources.length > 1 ? (
              <PanelSection>
                <PanelSectionTitle>Data source</PanelSectionTitle>
                <PanelSelect
                  size="small"
                  value={dataSource.id}
                  aria-label="Chart data source"
                  onChange={(event) => onChangeDataSource(event.target.value as string)}
                >
                  {dataSources.map((source) => (
                    <MenuItem key={source.id} value={source.id}>
                      {typeof source.label === 'string' ? source.label : String(source.label)}
                    </MenuItem>
                  ))}
                </PanelSelect>
              </PanelSection>
            ) : null}

            <PanelSection>
              <PanelSectionTitle>Visualize</PanelSectionTitle>
              <VizTypeGrid>
                {CHART_TYPES.map(({ value, label, Icon }) => (
                  <VizTypeTile
                    key={value}
                    type="button"
                    selected={summary.chartType === value}
                    aria-pressed={summary.chartType === value}
                    aria-label={label}
                    onClick={() => commitSummary({ chartType: value })}
                  >
                    <Icon />
                    {label}
                  </VizTypeTile>
                ))}
              </VizTypeGrid>
            </PanelSection>

            <PanelSection>
              <PanelSectionTitle>Summarize</PanelSectionTitle>
              <FieldGroup>
                <FieldLabel id="ds-chart-metric-label">
                  {summary.metrics.length > 1 ? 'Metrics' : 'Metric'}
                </FieldLabel>
                {summary.metrics.map((metric, index) => (
                  <MetricRow key={index}>
                    <MetricFields>
                      <PanelSelect
                        size="small"
                        value={metric.agg}
                        aria-label={`Metric ${index + 1} aggregation`}
                        onChange={(event) => {
                          const agg = event.target.value as MetricAgg;
                          const field =
                            agg === 'count' ? null : (metric.field ?? nextMeasure?.field ?? null);
                          updateMetric(index, { agg, field });
                        }}
                      >
                        {METRIC_AGGS.map(({ value, label }) => (
                          <MenuItem
                            key={value}
                            value={value}
                            disabled={value !== 'count' && measures.length === 0}
                          >
                            {label}
                          </MenuItem>
                        ))}
                      </PanelSelect>
                      {metric.agg !== 'count' && measures.length > 0 ? (
                        <PanelSelect
                          size="small"
                          value={metric.field ?? ''}
                          aria-label={`Metric ${index + 1} column`}
                          onChange={(event) =>
                            updateMetric(index, { field: event.target.value as string })
                          }
                        >
                          {measures.map((column) => (
                            <MenuItem key={column.field} value={column.field}>
                              {column.headerName ?? column.field}
                            </MenuItem>
                          ))}
                        </PanelSelect>
                      ) : null}
                    </MetricFields>
                    {summary.metrics.length > 1 ? (
                      <RemoveMetricButton
                        size="small"
                        aria-label={`Remove metric ${index + 1}`}
                        onClick={() => removeMetric(index)}
                      >
                        <CloseIcon />
                      </RemoveMetricButton>
                    ) : null}
                  </MetricRow>
                ))}
                {nextMeasure ? (
                  <AddMetricButton size="small" onClick={handleAddMetric}>
                    + Add metric
                  </AddMetricButton>
                ) : null}
              </FieldGroup>

              <FieldGroup>
                <FieldLabel id="ds-chart-group-label">Group by</FieldLabel>
                <PanelSelect
                  size="small"
                  displayEmpty
                  value={summary.groupBy ?? ''}
                  aria-labelledby="ds-chart-group-label"
                  onChange={(event) =>
                    commitSummary({ groupBy: (event.target.value as string) || null })
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {groupByColumns.map((column) => (
                    <MenuItem key={column.field} value={column.field}>
                      {column.headerName ?? column.field}
                    </MenuItem>
                  ))}
                </PanelSelect>
              </FieldGroup>

              {isDateGroup ? (
                <FieldGroup>
                  <FieldLabel id="ds-chart-bin-label">Granularity</FieldLabel>
                  <PanelSelect
                    size="small"
                    value={dateBin}
                    aria-labelledby="ds-chart-bin-label"
                    onChange={(event) =>
                      commitSummary({ dateBin: event.target.value as DateGranularity })
                    }
                  >
                    {DATE_GRANULARITIES.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </PanelSelect>
                </FieldGroup>
              ) : null}

              {isNumericGroup ? (
                <FieldGroup>
                  <FieldLabel id="ds-chart-numbin-label">Bins</FieldLabel>
                  <PanelSelect
                    size="small"
                    value={numericBins}
                    aria-labelledby="ds-chart-numbin-label"
                    onChange={(event) => {
                      const value = event.target.value;
                      commitSummary({
                        numericBins: value === 'infinite' ? 'infinite' : Number(value),
                      });
                    }}
                  >
                    <MenuItem value="infinite">Infinite (each value)</MenuItem>
                    {NUMERIC_BIN_OPTIONS.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value} buckets
                      </MenuItem>
                    ))}
                  </PanelSelect>
                </FieldGroup>
              ) : null}

              {sampled ? (
                <SampleNote>
                  Based on a sample of {rows.length} rows — values are approximate.
                </SampleNote>
              ) : null}
            </PanelSection>
          </ConfigPanel>
        </ChartBody>
      </ChartViewRoot>
    </GridChartsIntegrationContextProvider>
  );
}

/**
 * Built-in `'chart'` view type — a Metabase-style chart workspace over a Sheet's
 * bound Data Source. The chart canvas is the hero; a Visualize + Summarize panel
 * (Metric defaulting to Count of rows + Group by) drives a headless
 * DataGridPremium charts-integration engine, and a Chart/Data toggle reveals the
 * underlying table. Premium-only; registered by default on `plan="premium"`.
 */
export const chartViewType: DataStudioViewType<ChartViewParams> = {
  type: 'chart',
  // Renders its grid on the shared apiRef, so the menu bar / toolbar act on it.
  gridBacked: true,
  defaultLabel: 'Chart',
  paramsSchema: {
    type: 'object',
    properties: {
      summary: {
        type: 'object',
        description:
          'Metabase-style chart summary: { metricAgg, metricField, groupBy, chartType }.',
      },
    },
  },
  Component: ChartView,
};
