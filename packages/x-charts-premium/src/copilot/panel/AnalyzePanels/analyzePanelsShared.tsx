'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { chartCopilotClasses } from '../chartCopilotClasses';

/**
 * A resolved series ready for analysis: a stable id, a human label, and the
 * numeric data (nulls allowed). Every analyze panel accepts this same shape so
 * a single resolver can feed all of them.
 */
export interface AnalyzeSeries {
  id: string;
  label: string;
  data: (number | null)[];
}

export interface AnalyzePanelBaseProps {
  /** The resolved series to analyze. */
  series: AnalyzeSeries[];
  /** Override or extend the styles applied to the component. */
  className?: string;
}

/** Formats a number with compact suffixes (1.2K, 3.4M) for big values. */
export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${trimZeros(value / 1_000_000)}M`;
  }
  if (abs >= 1_000) {
    return `${trimZeros(value / 1_000)}K`;
  }
  return trimZeros(value);
}

/** Formats a number for a stat readout, trimming to at most 3 decimals. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return trimZeros(value);
}

/** Rounds to 3 decimals and drops trailing zeros. */
function trimZeros(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

/** Formats a signed percentage (e.g. "+12.3%", "-4%"). */
export function formatSignedPct(value: number): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  const rounded = Math.round(value * 10) / 10;
  return `${rounded >= 0 ? '+' : ''}${rounded}%`;
}

/** Root shell shared by every analyze panel; owns padding and scroll. */
export const AnalyzePanelRoot = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'AnalyzePanel',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100%',
  boxSizing: 'border-box',
  overflowY: 'auto',
  color: (theme.vars ?? theme).palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
}));

/** A titled section that groups one series' results inside a panel. */
export const AnalyzeSection = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  borderRadius: (theme.vars ?? theme).shape.borderRadius,
  border: `1px solid ${theme.alpha((theme.vars ?? theme).palette.text.primary, 0.12)}`,
  backgroundColor: theme.alpha((theme.vars ?? theme).palette.text.primary, 0.02),
  padding: theme.spacing(1.5),
}));

export const AnalyzeSectionHeader = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'AnalyzePanelHeader',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  fontWeight: theme.typography.fontWeightMedium,
}));

export const AnalyzePanelTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.subtitle2.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: theme.alpha((theme.vars ?? theme).palette.text.primary, 0.7),
}));

export const AnalyzeEmpty = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
}));

/** Common wrapper that applies the analyzePanel class + a section title. */
export function AnalyzePanelShell(props: {
  title: string;
  className?: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
}) {
  const { title, className, children, headerExtra } = props;
  return (
    <AnalyzePanelRoot className={clsx(chartCopilotClasses.analyzePanel, className)}>
      <AnalyzeSectionHeader className={chartCopilotClasses.analyzePanelHeader}>
        <AnalyzePanelTitle>{title}</AnalyzePanelTitle>
        {headerExtra}
      </AnalyzeSectionHeader>
      {children}
    </AnalyzePanelRoot>
  );
}
