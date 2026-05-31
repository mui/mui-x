'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { computeSummaryStats } from '../analysis';
import { chartCopilotClasses } from './chartCopilotClasses';

export interface AnswerBannerSeries {
  id: string;
  label: string;
  data: (number | null)[];
}

export interface AnswerBannerProps {
  /** The resolved value series; the first is treated as the headline series. */
  series: AnswerBannerSeries[];
}

const AnswerBannerRoot = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'AnswerBanner',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  fontSize: theme.typography.pxToRem(13),
  color: (theme.vars ?? theme).palette.text.secondary,
}));

const AnswerHeadline = styled('span')(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars ?? theme).palette.text.primary,
}));

const AnswerDelta = styled('span', {
  shouldForwardProp: (prop) => prop !== 'positive',
})<{ positive: boolean }>(({ theme, positive }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: positive
    ? (theme.vars ?? theme).palette.success.main
    : (theme.vars ?? theme).palette.error.main,
}));

const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

/**
 * The one-line numeric answer shown above the chart (PRD "Ask"). The headline is
 * computed client-side from the resolved series via `computeSummaryStats` — the
 * LLM never produces the number, so it is always grounded in the data.
 */
export function AnswerBanner(props: AnswerBannerProps) {
  const { series } = props;

  const headline = React.useMemo(() => {
    const primary = series[0];
    if (!primary) {
      return null;
    }
    const stats = computeSummaryStats(primary.data);
    if (stats.points === 0) {
      return null;
    }
    return { label: primary.label, total: stats.total, changePct: stats.changePct };
  }, [series]);

  if (!headline) {
    return null;
  }

  const hasDelta = Number.isFinite(headline.changePct) && headline.changePct !== 0;
  const positive = headline.changePct > 0;

  return (
    <AnswerBannerRoot className={chartCopilotClasses.answerBanner}>
      <span>{headline.label}</span>
      <AnswerHeadline>{compactNumber.format(headline.total)}</AnswerHeadline>
      {hasDelta ? (
        <AnswerDelta positive={positive}>
          {positive ? '↑' : '↓'}
          {Math.abs(headline.changePct).toFixed(1)}%
        </AnswerDelta>
      ) : null}
    </AnswerBannerRoot>
  );
}
