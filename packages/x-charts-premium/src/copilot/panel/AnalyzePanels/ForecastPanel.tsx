'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { computeForecast, type ForecastResult } from '../../analysis';
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

export interface ForecastPanelProps extends AnalyzePanelBaseProps {
  /** Number of future steps to project (default 12). */
  steps?: number;
}

const DEFAULT_STEPS = 12;

const TrendRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(0.5),
}));

const TrendArrow = styled('span', {
  shouldForwardProp: (prop) => prop !== 'slope',
})<{ slope: number }>(({ theme, slope }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color:
    slope >= 0
      ? (theme.vars ?? theme).palette.success.main
      : (theme.vars ?? theme).palette.error.main,
}));

const FitLabel = styled('span', {
  shouldForwardProp: (prop) => prop !== 'fit',
})<{ fit: ForecastResult['fit'] }>(({ theme, fit }) => {
  let color: string;
  if (fit === 'strong') {
    color = (theme.vars ?? theme).palette.success.main;
  } else if (fit === 'moderate') {
    color = (theme.vars ?? theme).palette.warning.main;
  } else {
    color = (theme.vars ?? theme).palette.text.secondary;
  }
  return {
    fontWeight: theme.typography.fontWeightBold,
    color,
  };
});

const Projection = styled('div')(({ theme }) => ({
  fontVariantNumeric: 'tabular-nums',
  color: (theme.vars ?? theme).palette.text.secondary,
}));

/**
 * Renders a per-series linear-trend summary: slope per step (with an up/down
 * arrow), `R² = … — <fit> fit`, and the projected start→end over N steps.
 * Computes via `computeForecast`. The spec notes this is linear-only.
 */
export function ForecastPanel(props: ForecastPanelProps) {
  const { series, steps = DEFAULT_STEPS, className } = props;

  const computed = React.useMemo(
    () => series.map((s) => ({ id: s.id, label: s.label, result: computeForecast(s.data, steps) })),
    [series, steps],
  );

  return (
    <AnalyzePanelRoot
      className={className ? `${chartCopilotClasses.analyzePanel} ${className}` : chartCopilotClasses.analyzePanel}
    >
      <AnalyzePanelTitle>Forecast</AnalyzePanelTitle>
      {computed.length === 0 ? (
        <AnalyzeEmpty>No series to forecast.</AnalyzeEmpty>
      ) : (
        computed.map(({ id, label, result }) => {
          const projectedEnd =
            result.projected.length > 0
              ? result.projected[result.projected.length - 1]
              : result.endValue;
          return (
            <AnalyzeSection key={id}>
              <AnalyzeSectionHeader className={chartCopilotClasses.analyzePanelHeader}>
                <span>{label}</span>
                <span>LINEAR TREND</span>
              </AnalyzeSectionHeader>
              <TrendRow>
                <TrendArrow slope={result.slope} aria-hidden>
                  {result.slope >= 0 ? '↗' : '↘'}
                </TrendArrow>
                <span>{formatNumber(result.slope)} / step</span>
              </TrendRow>
              <div>
                R² = {formatNumber(result.r2)} —{' '}
                <FitLabel fit={result.fit}>{result.fit} fit</FitLabel>
              </div>
              <Projection>
                Projected: {formatNumber(result.startValue)} → {formatNumber(projectedEnd)} (
                {steps} steps)
              </Projection>
            </AnalyzeSection>
          );
        })
      )}
    </AnalyzePanelRoot>
  );
}
