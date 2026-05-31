'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { computeCorrelations, type CorrelationResult } from '../../analysis';
import {
  AnalyzeEmpty,
  AnalyzePanelRoot,
  AnalyzePanelTitle,
  formatNumber,
  type AnalyzePanelBaseProps,
} from './analyzePanelsShared';
import { chartCopilotClasses } from '../chartCopilotClasses';

const PairRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  paddingBottom: theme.spacing(1),
}));

const PairHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

const PairLabel = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const PairValue = styled('span')(({ theme }) => ({
  fontVariantNumeric: 'tabular-nums',
  fontWeight: theme.typography.fontWeightBold,
}));

const StrengthLabel = styled('span', {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'positive' | 'negative' | 'muted' }>(({ theme, tone }) => {
  let color: string;
  if (tone === 'muted') {
    color = (theme.vars ?? theme).palette.text.secondary;
  } else if (tone === 'positive') {
    color = (theme.vars ?? theme).palette.success.main;
  } else {
    color = (theme.vars ?? theme).palette.error.main;
  }
  return {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color,
  };
});

// A diverging bar: a center spine with the fill growing left (negative) or
// right (positive) proportional to |r|.
const BarTrack = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.alpha((theme.vars ?? theme).palette.text.primary, 0.08),
  overflow: 'hidden',
}));

const BarCenter = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: '50%',
  width: 1,
  backgroundColor: theme.alpha((theme.vars ?? theme).palette.text.primary, 0.3),
}));

const BarFill = styled('div', {
  shouldForwardProp: (prop) => prop !== 'r',
})<{ r: number }>(({ theme, r }) => {
  const positive = r >= 0;
  const color = positive
    ? (theme.vars ?? theme).palette.success.main
    : (theme.vars ?? theme).palette.error.main;
  const pct = Math.min(Math.abs(r), 1) * 50;
  return {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: color,
    width: `${pct}%`,
    ...(positive ? { left: '50%' } : { right: '50%' }),
  };
});

/** Builds the "STRONG NEGATIVE" style label from a correlation result. */
function describe(result: CorrelationResult): { text: string; tone: 'positive' | 'negative' | 'muted' } {
  if (result.strength === 'none') {
    return { text: 'NO CORRELATION', tone: 'muted' };
  }
  return {
    text: `${result.strength} ${result.direction}`.toUpperCase(),
    tone: result.direction === 'positive' ? 'positive' : 'negative',
  };
}

/**
 * Renders one diverging bar per series pair: a centered track with the fill
 * growing right for positive `r` and left for negative, plus the `r` value and
 * a strength/direction label. Computes via `computeCorrelations`.
 */
export function CorrelationsPanel(props: AnalyzePanelBaseProps) {
  const { series, className } = props;

  const results = React.useMemo(() => {
    const map: Record<string, (number | null)[]> = {};
    for (const s of series) {
      map[s.label] = s.data;
    }
    return computeCorrelations(map);
  }, [series]);

  return (
    <AnalyzePanelRoot
      className={className ? `${chartCopilotClasses.analyzePanel} ${className}` : chartCopilotClasses.analyzePanel}
    >
      <AnalyzePanelTitle>Correlations</AnalyzePanelTitle>
      {results.length === 0 ? (
        <AnalyzeEmpty>Need at least two series to correlate.</AnalyzeEmpty>
      ) : (
        results.map((result) => {
          const { text, tone } = describe(result);
          return (
            <PairRow key={`${result.a}__${result.b}`}>
              <PairHeader>
                <PairLabel>
                  {result.a} ↔ {result.b}
                </PairLabel>
                <PairValue>{formatNumber(result.r)}</PairValue>
              </PairHeader>
              <BarTrack>
                <BarFill r={result.r} />
                <BarCenter />
              </BarTrack>
              <StrengthLabel tone={tone}>{text}</StrengthLabel>
            </PairRow>
          );
        })
      )}
    </AnalyzePanelRoot>
  );
}
