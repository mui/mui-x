'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { createSvgIcon } from '@mui/material/utils';
import type { GridColDef } from '@mui/x-data-grid';
import { styled } from '../internals/zero-styled';
import {
  isDateLikeColumn,
  isIdLikeColumn,
  pickMeasureColumns,
  pickBestDimension,
} from './columnHeuristics';
import {
  DATE_GRANULARITIES,
  DEFAULT_NUMERIC_BINS,
  NUMERIC_BIN_OPTIONS,
  dateBucket,
  numericBucket,
  numericBucketLabel,
  numericExtent,
  type DateGranularity,
} from './binning';
import type { DataStudioViewRenderProps, DataStudioViewType } from './types';

const MAX_BREAKDOWN_ROWS = 6;
// Binned (date/numeric) breakdowns show more rows so the histogram is legible.
const MAX_BINNED_BREAKDOWN_ROWS = 12;
const DEFAULT_METRIC_TILES = 3;
// Rows sampled from a server connector to compute insights when no local rows
// are available. Sample-based aggregates are approximate.
const SERVER_SAMPLE_SIZE = 500;

const AddIcon = createSvgIcon(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />, 'Add');
const CloseIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'Close',
);

type DashboardAggregation = 'sum' | 'avg' | 'count' | 'min' | 'max';

interface MetricTile {
  id: string;
  kind: 'metric';
  field: string;
  agg: DashboardAggregation;
}
interface BreakdownTile {
  id: string;
  kind: 'breakdown';
  dimension: string;
  measure: string;
  agg: DashboardAggregation;
  /** Bucket size when `dimension` is a date column. */
  dateBin?: DateGranularity;
  /** Bracket count when `dimension` is a numeric column. */
  numericBins?: number;
}
type DashboardTile = MetricTile | BreakdownTile;

export interface DashboardViewParams {
  /**
   * The dashboard's configured tiles (metric KPIs + breakdowns). When absent, a
   * default set is generated from the Data Source's columns and materialized on
   * the first edit.
   */
  tiles?: DashboardTile[];
}

const AGGREGATIONS: Array<{ value: DashboardAggregation; label: string }> = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Avg' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
];

const integerFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const compactFormat = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const EMPTY_ROWS: ReadonlyArray<Record<string, unknown>> = [];

let tileSeq = 0;
function nextTileId(): string {
  tileSeq += 1;
  return `tile-${Date.now().toString(36)}-${tileSeq}`;
}

function columnLabel(column: GridColDef | undefined, field: string): string {
  if (column && typeof column.headerName === 'string' && column.headerName) {
    return column.headerName;
  }
  return column?.field ?? field;
}

function toNumber(value: unknown): { n: number; present: boolean } {
  if (value == null || value === '') {
    return { n: 0, present: false };
  }
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? { n, present: true } : { n: 0, present: false };
}

/** Aggregate a single field across rows. Returns `null` when there are no values. */
function aggregate(
  rows: ReadonlyArray<Record<string, unknown>>,
  field: string,
  agg: DashboardAggregation,
): number | null {
  if (agg === 'count') {
    return rows.length;
  }
  let sum = 0;
  let present = 0;
  let min = Infinity;
  let max = -Infinity;
  for (const row of rows) {
    const { n, present: ok } = toNumber(row[field]);
    if (ok) {
      sum += n;
      present += 1;
      if (n < min) {
        min = n;
      }
      if (n > max) {
        max = n;
      }
    }
  }
  if (present === 0) {
    return null;
  }
  switch (agg) {
    case 'avg':
      return sum / present;
    case 'min':
      return min;
    case 'max':
      return max;
    default:
      return sum;
  }
}

/** A breakdown group's display label plus the value used to order it. */
interface BreakdownKey {
  label: string;
  sort: number | string;
}

// Group rows by `keyOf` and aggregate `measure` per group. Categorical breakdowns
// sort by value (top N); binned (date/numeric) breakdowns sort by their natural
// bucket order (chronological / ascending) and show more rows so the histogram reads.
function groupAggregate(
  rows: ReadonlyArray<Record<string, unknown>>,
  keyOf: (row: Record<string, unknown>) => BreakdownKey | null,
  measure: string,
  agg: DashboardAggregation,
  sortByKey: boolean,
): Array<{ key: string; value: number }> {
  const buckets = new Map<string, { sort: number | string; rows: Record<string, unknown>[] }>();
  for (const row of rows) {
    const key = keyOf(row);
    if (key == null) {
      continue;
    }
    const existing = buckets.get(key.label);
    if (existing) {
      existing.rows.push(row);
    } else {
      buckets.set(key.label, { sort: key.sort, rows: [row] });
    }
  }
  const entries = [...buckets.entries()].map(([label, bucket]) => ({
    key: label,
    sort: bucket.sort,
    value: aggregate(bucket.rows, measure, agg) ?? 0,
  }));
  entries.sort((a, b) => {
    if (sortByKey) {
      if (a.sort < b.sort) {
        return -1;
      }
      return a.sort > b.sort ? 1 : 0;
    }
    return b.value - a.value;
  });
  const limit = sortByKey ? MAX_BINNED_BREAKDOWN_ROWS : MAX_BREAKDOWN_ROWS;
  return entries.slice(0, limit).map(({ key, value }) => ({ key, value }));
}

/** Seed a sensible default set of tiles from a Data Source's columns + rows. */
function buildDefaultTiles(
  columns: readonly GridColDef[],
  idField: string,
  rows: ReadonlyArray<Record<string, unknown>>,
): DashboardTile[] {
  const measures = pickMeasureColumns(columns, idField).filter(
    (column) => aggregate(rows, column.field, 'sum') !== null,
  );
  const dimension = pickBestDimension(columns, idField, rows);
  const tiles: DashboardTile[] = measures
    .slice(0, DEFAULT_METRIC_TILES)
    .map((column) => ({ id: nextTileId(), kind: 'metric', field: column.field, agg: 'sum' }));
  if (dimension && measures[0]) {
    tiles.push({
      id: nextTileId(),
      kind: 'breakdown',
      dimension,
      measure: measures[0].field,
      agg: 'sum',
    });
  }
  return tiles;
}

const DashboardRoot = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'auto',
  padding: theme.spacing(3),
  // Recess the canvas so the white paper tiles lift off it (light + dark).
  backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.02),
}));

const DashboardInner = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  maxWidth: 1100,
}));

const DashboardToolbar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ToolbarButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8125rem',
  minHeight: 36,
});

const SampleNote = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  lineHeight: 1.5,
  maxWidth: '68ch',
  color: (theme.vars || theme).palette.text.secondary,
}));

const TileGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 280px))',
  justifyContent: 'start',
  gap: theme.spacing(2),
}));

const TileCard = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.alpha((theme.vars || theme).palette.text.primary, 0.18)}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(['border-color', 'box-shadow'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    borderColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.23),
    boxShadow: theme.shadows[2],
  },
  '&:hover .DataStudioDashboard-removeTile': { opacity: 1 },
  '&:focus-within .DataStudioDashboard-removeTile': { opacity: 1 },
}));

const BreakdownTileCard = styled(TileCard)({ gridColumn: '1 / -1' });

const TileConfig = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  lineHeight: 1.5,
  // Eyebrow caption: unify the aggregation Select + unit word into one label.
  textTransform: 'uppercase',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  color: (theme.vars || theme).palette.text.secondary,
  paddingRight: theme.spacing(4),
}));

const RemoveTileButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  padding: theme.spacing(0.75),
  // Discoverable at rest (not hover-only); fully revealed on hover/focus.
  opacity: 0.55,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shortest,
  }),
  color: (theme.vars || theme).palette.text.secondary,
  '&:focus-visible': { opacity: 1 },
}));

const TileSelect = styled(Select)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  verticalAlign: 'middle',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.04),
  cursor: 'pointer',
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.08),
  },
  // Darken the caret so the trigger reads as an editable control.
  '& .MuiSelect-icon': { color: 'currentColor' },
  // Land the hit box at >=32px tall for touch targets.
  '& .MuiSelect-select': { padding: theme.spacing(0.75, 2.5, 0.75, 1) },
}));

const MetricValue = styled('div')(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.01em',
  fontVariantNumeric: 'tabular-nums',
  color: (theme.vars || theme).palette.text.primary,
  marginTop: theme.spacing(0.75),
}));

const StaticMetricLabel = styled('div')(({ theme }) => ({
  textTransform: 'uppercase',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  color: (theme.vars || theme).palette.text.secondary,
}));

const BreakdownTitle = styled('h3')(({ theme }) => ({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: (theme.vars || theme).palette.text.primary,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const BreakdownRow = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '160px 1fr minmax(56px, auto)',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  fontSize: '0.8125rem',
  marginBottom: theme.spacing(1),
}));

const BreakdownLabel = styled('div')(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: (theme.vars || theme).palette.text.primary,
}));

const BreakdownTrack = styled('div')(({ theme }) => ({
  height: 10,
  borderRadius: 9999,
  // Same-hue track so the bar shares a temperature with its fill.
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.12),
  overflow: 'hidden',
}));

const BreakdownBar = styled('div')(({ theme }) => ({
  height: '100%',
  borderRadius: 9999,
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.85),
  transition: theme.transitions.create('width', {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.easeOut,
  }),
}));

const BreakdownValue = styled('div')(({ theme }) => ({
  fontVariantNumeric: 'tabular-nums',
  color: (theme.vars || theme).palette.text.secondary,
  textAlign: 'right',
}));

const EmptyTileBody = styled('div')(({ theme }) => ({
  fontSize: '0.8125rem',
  fontStyle: 'italic',
  textAlign: 'center',
  color: theme.alpha((theme.vars || theme).palette.text.secondary, 0.7),
  marginTop: theme.spacing(1),
}));

const DashboardEmpty = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(4),
  textAlign: 'center',
  color: (theme.vars || theme).palette.text.secondary,
}));

const DashboardEmptyHeading = styled('div')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: (theme.vars || theme).palette.text.primary,
}));

// Centered empty-state block for the "has data but zero tiles" case, so the
// canvas reads intentional rather than abandoned.
const DashboardEmptyTiles = styled('div')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  minHeight: 240,
  gap: theme.spacing(1),
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const DashboardEmptyActions = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

function AggregationSelect(props: {
  value: DashboardAggregation;
  onChange: (agg: DashboardAggregation) => void;
}) {
  return (
    <TileSelect
      variant="standard"
      disableUnderline
      value={props.value}
      onChange={(event) => props.onChange(event.target.value as DashboardAggregation)}
      aria-label="Aggregation"
    >
      {AGGREGATIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TileSelect>
  );
}

function FieldSelect(props: {
  value: string;
  columns: GridColDef[];
  ariaLabel: string;
  onChange: (field: string) => void;
}) {
  return (
    <TileSelect
      variant="standard"
      disableUnderline
      value={props.columns.some((c) => c.field === props.value) ? props.value : ''}
      onChange={(event) => props.onChange(event.target.value as string)}
      aria-label={props.ariaLabel}
    >
      {props.columns.map((column) => (
        <MenuItem key={column.field} value={column.field}>
          {columnLabel(column, column.field)}
        </MenuItem>
      ))}
    </TileSelect>
  );
}

function OptionSelect<T extends string | number>(props: {
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  ariaLabel: string;
  onChange: (value: T) => void;
}) {
  return (
    <TileSelect
      variant="standard"
      disableUnderline
      value={props.value}
      onChange={(event) => props.onChange(event.target.value as T)}
      aria-label={props.ariaLabel}
    >
      {props.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TileSelect>
  );
}

const NUMERIC_BIN_SELECT_OPTIONS = NUMERIC_BIN_OPTIONS.map((value) => ({
  value,
  label: `${value} bins`,
}));

interface MetricTileProps {
  tile: MetricTile;
  rows: ReadonlyArray<Record<string, unknown>>;
  measureColumns: GridColDef[];
  onChange: (patch: Partial<MetricTile>) => void;
  onRemove: () => void;
}

interface BreakdownTileProps {
  tile: BreakdownTile;
  rows: ReadonlyArray<Record<string, unknown>>;
  columns: GridColDef[];
  measureColumns: GridColDef[];
  dimensionColumns: GridColDef[];
  onChange: (patch: Partial<BreakdownTile>) => void;
  onRemove: () => void;
}

function MetricTileView(props: MetricTileProps) {
  const { tile, rows, measureColumns, onChange, onRemove } = props;
  const value = aggregate(rows, tile.field, tile.agg);
  return (
    <TileCard role="group" aria-label="Metric tile">
      <RemoveTileButton
        className="DataStudioDashboard-removeTile"
        size="small"
        onClick={onRemove}
        aria-label="Remove tile"
      >
        <CloseIcon fontSize="small" />
      </RemoveTileButton>
      <TileConfig>
        <AggregationSelect value={tile.agg} onChange={(agg) => onChange({ agg } as Partial<MetricTile>)} />
        {tile.agg === 'count' ? (
          <StaticMetricLabel>records</StaticMetricLabel>
        ) : (
          <FieldSelect
            value={tile.field}
            columns={measureColumns}
            ariaLabel="Metric field"
            onChange={(field) => onChange({ field } as Partial<MetricTile>)}
          />
        )}
      </TileConfig>
      {value == null ? (
        <EmptyTileBody>No values</EmptyTileBody>
      ) : (
        <MetricValue>{compactFormat.format(value)}</MetricValue>
      )}
    </TileCard>
  );
}

function BreakdownTileView(props: BreakdownTileProps) {
  const { tile, rows, columns, measureColumns, dimensionColumns, onChange, onRemove } = props;
  const dimensionColumn = columns.find((c) => c.field === tile.dimension);
  const isDateDimension = Boolean(dimensionColumn && isDateLikeColumn(dimensionColumn));
  const isNumericDimension = Boolean(
    dimensionColumn && dimensionColumn.type === 'number' && !isDateDimension,
  );
  const dateBin = tile.dateBin ?? 'month';
  const numericBins = tile.numericBins ?? DEFAULT_NUMERIC_BINS;
  const extent = isNumericDimension ? numericExtent(rows, tile.dimension) : null;

  // Build the group key: a date bucket, a numeric bracket (range label, ordered by
  // its lower bound), or the raw categorical value.
  const keyOf = (row: Record<string, unknown>): BreakdownKey | null => {
    if (isDateDimension) {
      const bucket = dateBucket(row[tile.dimension], dateBin);
      return bucket == null ? null : { label: bucket, sort: bucket };
    }
    if (isNumericDimension && extent) {
      const bound = numericBucket(Number(row[tile.dimension]), extent.min, extent.max, numericBins);
      return bound == null
        ? null
        : { label: numericBucketLabel(bound, extent.min, extent.max, numericBins), sort: bound };
    }
    const raw = row[tile.dimension];
    if (raw == null || raw === '') {
      return null;
    }
    const label = String(raw);
    return { label, sort: label };
  };
  const isBinned = isDateDimension || isNumericDimension;
  const data = groupAggregate(rows, keyOf, tile.measure, tile.agg, isBinned);
  const max = data.reduce((acc, item) => Math.max(acc, item.value), 0);
  return (
    <BreakdownTileCard role="group" aria-label="Breakdown tile">
      <RemoveTileButton
        className="DataStudioDashboard-removeTile"
        size="small"
        onClick={onRemove}
        aria-label="Remove tile"
      >
        <CloseIcon fontSize="small" />
      </RemoveTileButton>
      <TileConfig>
        <AggregationSelect
          value={tile.agg}
          onChange={(agg) => onChange({ agg } as Partial<BreakdownTile>)}
        />
        <FieldSelect
          value={tile.measure}
          columns={measureColumns}
          ariaLabel="Measure field"
          onChange={(measure) => onChange({ measure } as Partial<BreakdownTile>)}
        />
        <span>by</span>
        <FieldSelect
          value={tile.dimension}
          columns={dimensionColumns}
          ariaLabel="Dimension field"
          onChange={(dimension) => onChange({ dimension } as Partial<BreakdownTile>)}
        />
        {isDateDimension ? (
          <OptionSelect
            value={dateBin}
            options={DATE_GRANULARITIES}
            ariaLabel="Date granularity"
            onChange={(value) => onChange({ dateBin: value } as Partial<BreakdownTile>)}
          />
        ) : null}
        {isNumericDimension ? (
          <OptionSelect
            value={numericBins}
            options={NUMERIC_BIN_SELECT_OPTIONS}
            ariaLabel="Bin count"
            onChange={(value) => onChange({ numericBins: value } as Partial<BreakdownTile>)}
          />
        ) : null}
      </TileConfig>
      <BreakdownTitle>
        {columnLabel(
          columns.find((c) => c.field === tile.measure),
          tile.measure,
        )}{' '}
        by{' '}
        {columnLabel(
          columns.find((c) => c.field === tile.dimension),
          tile.dimension,
        )}
      </BreakdownTitle>
      {data.length === 0 ? (
        <EmptyTileBody>No groups to show for this combination.</EmptyTileBody>
      ) : (
        data.map((item) => (
          <BreakdownRow key={item.key}>
            <BreakdownLabel title={item.key}>{item.key}</BreakdownLabel>
            <BreakdownTrack
              role="meter"
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-label={`${item.key}: ${compactFormat.format(item.value)}`}
            >
              <BreakdownBar style={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }} />
            </BreakdownTrack>
            <BreakdownValue>{compactFormat.format(item.value)}</BreakdownValue>
          </BreakdownRow>
        ))
      )}
    </BreakdownTileCard>
  );
}

type SampleState = {
  status: 'idle' | 'loading' | 'error';
  rows: ReadonlyArray<Record<string, unknown>> | null;
};

function DashboardView(props: DataStudioViewRenderProps<DashboardViewParams>) {
  const { dataSource, params, setParams } = props;

  const hasLocalRows = (dataSource?.rows?.length ?? 0) > 0;
  const canSample = Boolean(dataSource?.connector) && !hasLocalRows;
  const [sample, setSample] = React.useState<SampleState>({ status: 'idle', rows: null });

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

  const rows = React.useMemo<ReadonlyArray<Record<string, unknown>>>(
    () =>
      hasLocalRows
        ? ((dataSource!.rows ?? EMPTY_ROWS) as ReadonlyArray<Record<string, unknown>>)
        : (sample.rows ?? EMPTY_ROWS),
    [hasLocalRows, dataSource, sample.rows],
  );
  const sampled = !hasLocalRows && sample.rows != null && rows.length > 0;

  const idField = dataSource?.rowIdField ?? 'id';
  const columns = React.useMemo<GridColDef[]>(() => dataSource?.columns ?? [], [dataSource]);
  const measureColumns = React.useMemo(
    () => columns.filter((c) => c.type === 'number' && c.field !== idField),
    [columns, idField],
  );
  const dimensionColumns = React.useMemo(
    () => columns.filter((c) => c.type !== 'number' && c.field !== idField),
    [columns, idField],
  );
  // Breakdowns can group by any non-id column — categorical, date (binned by
  // granularity), or numeric (binned into brackets).
  const breakdownDimensionColumns = React.useMemo(
    () => columns.filter((c) => c.field !== idField && !isIdLikeColumn(c)),
    [columns, idField],
  );

  // Effective tiles: the persisted set, or a generated default once we have data.
  const tiles = React.useMemo<DashboardTile[]>(() => {
    if (params.tiles) {
      return params.tiles;
    }
    if (rows.length === 0) {
      return [];
    }
    return buildDefaultTiles(columns, idField, rows);
  }, [params.tiles, columns, idField, rows]);

  const commitTiles = React.useCallback(
    (next: DashboardTile[]) => {
      setParams({ tiles: next });
    },
    [setParams],
  );

  const handleAddMetric = React.useCallback(() => {
    const field = measureColumns[0]?.field ?? '';
    commitTiles([
      ...tiles,
      { id: nextTileId(), kind: 'metric', field, agg: field ? 'sum' : 'count' },
    ]);
  }, [tiles, measureColumns, commitTiles]);

  const handleAddBreakdown = React.useCallback(() => {
    const measure = measureColumns[0]?.field ?? '';
    const dimension = pickBestDimension(columns, idField, rows) ?? dimensionColumns[0]?.field ?? '';
    commitTiles([...tiles, { id: nextTileId(), kind: 'breakdown', dimension, measure, agg: 'sum' }]);
  }, [tiles, measureColumns, dimensionColumns, columns, idField, rows, commitTiles]);

  const updateTile = React.useCallback(
    (id: string, patch: Partial<DashboardTile>) => {
      commitTiles(tiles.map((tile) => (tile.id === id ? ({ ...tile, ...patch } as DashboardTile) : tile)));
    },
    [tiles, commitTiles],
  );

  const removeTile = React.useCallback(
    (id: string) => {
      commitTiles(tiles.filter((tile) => tile.id !== id));
    },
    [tiles, commitTiles],
  );

  const breakdownDisabled = dimensionColumns.length === 0 || measureColumns.length === 0;

  if (!dataSource) {
    return (
      <DashboardEmpty>
        <DashboardEmptyHeading>No Data Source connected</DashboardEmptyHeading>
        <div>Create a dashboard from a Data Source&apos;s preview to build insights.</div>
      </DashboardEmpty>
    );
  }

  if (rows.length === 0) {
    if (sample.status === 'loading') {
      return (
        <DashboardEmpty>
          <DashboardEmptyHeading>Loading insights…</DashboardEmptyHeading>
          <div>Sampling rows from the Data Source.</div>
        </DashboardEmpty>
      );
    }
    if (sample.status === 'error') {
      return (
        <DashboardEmpty>
          <DashboardEmptyHeading>Insights unavailable</DashboardEmptyHeading>
          <div>The Data Source sample request failed; use a Pivot or Chart instead.</div>
        </DashboardEmpty>
      );
    }
    return (
      <DashboardEmpty>
        <DashboardEmptyHeading>No data to summarize</DashboardEmptyHeading>
        <div>This Data Source has no rows to build insights from.</div>
      </DashboardEmpty>
    );
  }

  return (
    <DashboardRoot>
      <DashboardInner>
        <DashboardToolbar role="toolbar" aria-label="Dashboard tiles">
          <ToolbarButton size="small" startIcon={<AddIcon />} onClick={handleAddMetric}>
            Metric
          </ToolbarButton>
          {breakdownDisabled ? (
            <Tooltip title="Requires a numeric and a category column">
              <span>
                <ToolbarButton size="small" startIcon={<AddIcon />} disabled>
                  Breakdown
                </ToolbarButton>
              </span>
            </Tooltip>
          ) : (
            <ToolbarButton size="small" startIcon={<AddIcon />} onClick={handleAddBreakdown}>
              Breakdown
            </ToolbarButton>
          )}
          <Tooltip title="Records in this Data Source">
            <SampleNote tabIndex={0} aria-label="Records in this Data Source" style={{ marginLeft: 'auto' }}>
              {integerFormat.format(rows.length)} {sampled ? 'sampled ' : ''}records
            </SampleNote>
          </Tooltip>
        </DashboardToolbar>

        {sampled ? (
          <SampleNote>
            Based on a sample of {integerFormat.format(rows.length)} rows — totals are approximate.
            Use a Pivot or Chart for exact server-side aggregation.
          </SampleNote>
        ) : null}

        {tiles.length === 0 ? (
          <DashboardEmptyTiles>
            <DashboardEmptyHeading>No tiles yet</DashboardEmptyHeading>
            <div>Add a Metric or Breakdown to start building insights.</div>
            <DashboardEmptyActions>
              <ToolbarButton size="small" startIcon={<AddIcon />} onClick={handleAddMetric}>
                Metric
              </ToolbarButton>
              {!breakdownDisabled ? (
                <ToolbarButton size="small" startIcon={<AddIcon />} onClick={handleAddBreakdown}>
                  Breakdown
                </ToolbarButton>
              ) : null}
            </DashboardEmptyActions>
          </DashboardEmptyTiles>
        ) : (
          <TileGrid>
            {tiles.map((tile) =>
              tile.kind === 'metric' ? (
                <MetricTileView
                  key={tile.id}
                  tile={tile}
                  rows={rows}
                  measureColumns={measureColumns}
                  onChange={(patch) => updateTile(tile.id, patch)}
                  onRemove={() => removeTile(tile.id)}
                />
              ) : (
                <BreakdownTileView
                  key={tile.id}
                  tile={tile}
                  rows={rows}
                  columns={columns}
                  measureColumns={measureColumns}
                  dimensionColumns={breakdownDimensionColumns}
                  onChange={(patch) => updateTile(tile.id, patch)}
                  onRemove={() => removeTile(tile.id)}
                />
              ),
            )}
          </TileGrid>
        )}
      </DashboardInner>
    </DashboardRoot>
  );
}

/**
 * Built-in `'dashboard'` view type — a configurable multi-tile analytics
 * dashboard over a Data Source. Users add / remove / configure **metric** KPI
 * tiles (field + aggregation) and **breakdown** tiles (measure by dimension);
 * the layout is seeded with sensible defaults and persisted to `sheet.params`.
 * Computed from the Data Source's rows (client-side), or a connector sample for
 * server-backed sources. Premium-only; registered by default on `plan="premium"`.
 */
export const dashboardViewType: DataStudioViewType<DashboardViewParams> = {
  type: 'dashboard',
  defaultLabel: 'Dashboard',
  ownsToolbar: true,
  Component: DashboardView,
};
