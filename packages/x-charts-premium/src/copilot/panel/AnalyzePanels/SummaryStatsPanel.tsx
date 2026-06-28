'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { computeSummaryStats } from '../../analysis';
import {
  AnalyzeEmpty,
  AnalyzePanelRoot,
  AnalyzeSection,
  AnalyzeSectionHeader,
  AnalyzePanelTitle,
  formatCompact,
  formatSignedPct,
  type AnalyzePanelBaseProps,
} from './analyzePanelsShared';
import { chartCopilotClasses } from '../chartCopilotClasses';

const StatGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
  gap: theme.spacing(1),
}));

const StatCard = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  borderRadius: (theme.vars ?? theme).shape.borderRadius,
  border: `1px solid ${theme.alpha((theme.vars ?? theme).palette.text.primary, 0.1)}`,
  padding: theme.spacing(1),
}));

const StatLabel = styled('span')(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: (theme.vars ?? theme).palette.text.secondary,
}));

const StatValue = styled('span')(({ theme }) => ({
  fontSize: theme.typography.subtitle1.fontSize,
  fontWeight: theme.typography.fontWeightBold,
}));

const ChangeBadge = styled('span', {
  shouldForwardProp: (prop) => prop !== 'positive',
})<{ positive: boolean }>(({ theme, positive }) => {
  const color = positive
    ? (theme.vars ?? theme).palette.success.main
    : (theme.vars ?? theme).palette.error.main;
  return {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    padding: theme.spacing(0.25, 1),
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    color,
    backgroundColor: theme.alpha(color, 0.14),
  };
});

const STAT_FIELDS: { key: 'min' | 'max' | 'mean' | 'median' | 'stdDev' | 'range' | 'total' | 'points'; label: string }[] =
  [
    { key: 'min', label: 'Min' },
    { key: 'max', label: 'Max' },
    { key: 'mean', label: 'Mean' },
    { key: 'median', label: 'Median' },
    { key: 'stdDev', label: 'Std Dev' },
    { key: 'range', label: 'Range' },
    { key: 'total', label: 'Total' },
    { key: 'points', label: 'Points' },
  ];

/**
 * Renders a stat-card grid per series (min/max/mean/median/stdDev/range/total/
 * points) with a colored first-to-last `changePct` badge in each header.
 * Presentational only: it computes via `computeSummaryStats` and shows numbers.
 */
export function SummaryStatsPanel(props: AnalyzePanelBaseProps) {
  const { series, className } = props;

  const computed = React.useMemo(
    () => series.map((s) => ({ id: s.id, label: s.label, stats: computeSummaryStats(s.data) })),
    [series],
  );

  return (
    <AnalyzePanelRoot
      className={className ? `${chartCopilotClasses.analyzePanel} ${className}` : chartCopilotClasses.analyzePanel}
    >
      <AnalyzePanelTitle>Summary statistics</AnalyzePanelTitle>
      {computed.length === 0 ? (
        <AnalyzeEmpty>No series to summarize.</AnalyzeEmpty>
      ) : (
        computed.map(({ id, label, stats }) => {
          const positive = stats.changePct >= 0;
          return (
            <AnalyzeSection key={id}>
              <AnalyzeSectionHeader className={chartCopilotClasses.analyzePanelHeader}>
                <span>{label}</span>
                <ChangeBadge positive={positive}>{formatSignedPct(stats.changePct)}</ChangeBadge>
              </AnalyzeSectionHeader>
              <StatGrid>
                {STAT_FIELDS.map((field) => (
                  <StatCard key={field.key}>
                    <StatLabel>{field.label}</StatLabel>
                    <StatValue>{formatCompact(stats[field.key])}</StatValue>
                  </StatCard>
                ))}
              </StatGrid>
            </AnalyzeSection>
          );
        })
      )}
    </AnalyzePanelRoot>
  );
}
