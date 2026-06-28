'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import { computeIndicator, type IndicatorKind } from '../../analysis';
import {
  AnalyzeEmpty,
  AnalyzePanelRoot,
  AnalyzeSection,
  AnalyzeSectionHeader,
  AnalyzePanelTitle,
  formatNumber,
  type AnalyzePanelBaseProps,
} from './analyzePanelsShared';
import { chartCopilotClasses } from '../chartCopilotClasses';

interface IndicatorOption {
  kind: IndicatorKind;
  label: string;
  description: string;
  /** Whether the period control applies to this indicator. */
  usesPeriod: boolean;
}

// The 7 supported kinds, with the financial ones flagged via their description.
const INDICATOR_OPTIONS: IndicatorOption[] = [
  { kind: 'sma', label: 'SMA', description: 'Simple moving average', usesPeriod: true },
  { kind: 'ema', label: 'EMA', description: 'Exponential moving average', usesPeriod: true },
  {
    kind: 'bollinger',
    label: 'Bollinger Bands',
    description: 'SMA ± 2 standard deviations',
    usesPeriod: true,
  },
  { kind: 'pivot', label: 'Pivot Points', description: 'Support / resistance levels', usesPeriod: false },
  { kind: 'linreg', label: 'Linear Regression', description: 'Trailing best-fit line', usesPeriod: true },
  { kind: 'rsi', label: 'RSI', description: "Wilder's relative strength index", usesPeriod: true },
  { kind: 'macd', label: 'MACD', description: 'EMA(12) − EMA(26) + signal', usesPeriod: false },
];

const Controls = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const PeriodRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const PeriodLabel = styled('span')(({ theme }) => ({
  minWidth: 96,
  color: (theme.vars ?? theme).palette.text.secondary,
}));

const LineRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  fontVariantNumeric: 'tabular-nums',
}));

const LineId = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}));

/** Returns the last non-null value in a line, for a compact "latest" preview. */
function lastValue(data: (number | null)[]): number | null {
  for (let i = data.length - 1; i >= 0; i -= 1) {
    const v = data[i];
    if (v != null && Number.isFinite(v)) {
      return v;
    }
  }
  return null;
}

/** Counts the non-null points in a line. */
function pointCount(data: (number | null)[]): number {
  let count = 0;
  for (let i = 0; i < data.length; i += 1) {
    const v = data[i];
    if (v != null && Number.isFinite(v)) {
      count += 1;
    }
  }
  return count;
}

/**
 * Indicator picker panel. Lets the user pick one of the 7 indicator kinds, the
 * series to apply it to, and a period, then previews the computed line(s) as a
 * summary table (point count + latest value per line). Panel-only: it computes
 * via `computeIndicator` and does NOT add anything to the chart.
 */
export function IndicatorsPanel(props: AnalyzePanelBaseProps) {
  const { series, className } = props;

  const [kind, setKind] = React.useState<IndicatorKind>('sma');
  const [seriesId, setSeriesId] = React.useState<string>(() => series[0]?.id ?? '');
  const [period, setPeriod] = React.useState<number>(14);

  // Keep the selected series valid as the series set changes.
  React.useEffect(() => {
    if (series.length > 0 && !series.some((s) => s.id === seriesId)) {
      setSeriesId(series[0].id);
    }
  }, [series, seriesId]);

  const option = INDICATOR_OPTIONS.find((o) => o.kind === kind) ?? INDICATOR_OPTIONS[0];
  const selected = series.find((s) => s.id === seriesId) ?? series[0];

  const result = React.useMemo(() => {
    if (!selected) {
      return null;
    }
    return computeIndicator(kind, selected.data, { period });
  }, [kind, selected, period]);

  if (series.length === 0) {
    return (
      <AnalyzePanelRoot
        className={className ? `${chartCopilotClasses.analyzePanel} ${className}` : chartCopilotClasses.analyzePanel}
      >
        <AnalyzePanelTitle>Indicators</AnalyzePanelTitle>
        <AnalyzeEmpty>No series to compute indicators on.</AnalyzeEmpty>
      </AnalyzePanelRoot>
    );
  }

  return (
    <AnalyzePanelRoot
      className={className ? `${chartCopilotClasses.analyzePanel} ${className}` : chartCopilotClasses.analyzePanel}
    >
      <AnalyzePanelTitle>Indicators</AnalyzePanelTitle>
      <Controls>
        <TextField
          select
          size="small"
          label="Indicator"
          value={kind}
          onChange={(event) => setKind(event.target.value as IndicatorKind)}
          helperText={option.description}
        >
          {INDICATOR_OPTIONS.map((o) => (
            <MenuItem key={o.kind} value={o.kind}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Apply to"
          value={selected ? selected.id : ''}
          onChange={(event) => setSeriesId(event.target.value)}
        >
          {series.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
        {option.usesPeriod ? (
          <PeriodRow>
            <PeriodLabel>Period: {period}</PeriodLabel>
            <Slider
              size="small"
              min={2}
              max={50}
              value={period}
              aria-label="Period"
              onChange={(_event, value) => setPeriod(Array.isArray(value) ? value[0] : value)}
            />
          </PeriodRow>
        ) : null}
      </Controls>
      {result ? (
        <AnalyzeSection>
          <AnalyzeSectionHeader className={chartCopilotClasses.analyzePanelHeader}>
            <span>
              {option.label}
              {option.usesPeriod ? ` (${result.period})` : ''}
            </span>
            <span>
              {result.series.length} {result.series.length === 1 ? 'line' : 'lines'}
            </span>
          </AnalyzeSectionHeader>
          {result.series.map((line) => {
            const latest = lastValue(line.data);
            return (
              <LineRow key={line.id}>
                <LineId>{line.id}</LineId>
                <span>
                  {pointCount(line.data)} pts · latest {latest == null ? '—' : formatNumber(latest)}
                </span>
              </LineRow>
            );
          })}
        </AnalyzeSection>
      ) : null}
    </AnalyzePanelRoot>
  );
}
