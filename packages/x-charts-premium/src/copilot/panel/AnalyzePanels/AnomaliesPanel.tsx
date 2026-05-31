'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { detectAnomalies, type Anomaly } from '../../analysis';
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

export interface AnomaliesPanelProps extends AnalyzePanelBaseProps {
  /** Multiple of the mean absolute step delta above which a point is flagged. */
  threshold?: number;
}

const CountHeadline = styled('div')(({ theme }) => ({
  fontSize: theme.typography.subtitle1.fontSize,
  fontWeight: theme.typography.fontWeightBold,
}));

const AnomalyCard = styled('div', {
  shouldForwardProp: (prop) => prop !== 'kind',
})<{ kind: Anomaly['kind'] }>(({ theme, kind }) => {
  const color =
    kind === 'drop'
      ? (theme.vars ?? theme).palette.error.main
      : (theme.vars ?? theme).palette.success.main;
  return {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: (theme.vars ?? theme).shape.borderRadius,
    borderLeft: `3px solid ${color}`,
    backgroundColor: theme.alpha(color, 0.08),
    padding: theme.spacing(0.75, 1),
  };
});

const AnomalyIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== 'kind',
})<{ kind: Anomaly['kind'] }>(({ theme, kind }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color:
    kind === 'drop'
      ? (theme.vars ?? theme).palette.error.main
      : (theme.vars ?? theme).palette.success.main,
}));

const AnomalyText = styled('span')({
  flex: 1,
});

/** Phrases one anomaly, e.g. "Drop of 62.7 at index 72 (12.2x the average change)". */
function describeAnomaly(anomaly: Anomaly): string {
  const verb = anomaly.kind === 'drop' ? 'Drop' : 'Spike';
  const magnitude = formatNumber(Math.abs(anomaly.delta));
  const ratio = formatNumber(anomaly.ratio);
  return `${verb} of ${magnitude} at index ${anomaly.index} (${ratio}× the average change)`;
}

/**
 * Renders "N anomalies detected" then, per series, a card for each flagged
 * point (↓ Drop / ↑ Spike) with the ratio description. Computes via
 * `detectAnomalies`; the `seriesId` is filled from each series' id.
 */
export function AnomaliesPanel(props: AnomaliesPanelProps) {
  const { series, threshold, className } = props;

  const grouped = React.useMemo(() => {
    return series.map((s) => ({
      id: s.id,
      label: s.label,
      anomalies: detectAnomalies(s.data, threshold == null ? undefined : { threshold }).map(
        (a) => ({ ...a, seriesId: s.id }),
      ),
    }));
  }, [series, threshold]);

  const total = grouped.reduce((sum, g) => sum + g.anomalies.length, 0);

  return (
    <AnalyzePanelRoot
      className={className ? `${chartCopilotClasses.analyzePanel} ${className}` : chartCopilotClasses.analyzePanel}
    >
      <AnalyzePanelTitle>Anomalies</AnalyzePanelTitle>
      <CountHeadline>
        {total} {total === 1 ? 'anomaly' : 'anomalies'} detected
      </CountHeadline>
      {grouped
        .filter((g) => g.anomalies.length > 0)
        .map((g) => (
          <AnalyzeSection key={g.id}>
            <AnalyzeSectionHeader className={chartCopilotClasses.analyzePanelHeader}>
              <span>{g.label}</span>
              <span>{g.anomalies.length}</span>
            </AnalyzeSectionHeader>
            {g.anomalies.map((anomaly) => (
              <AnomalyCard key={anomaly.index} kind={anomaly.kind}>
                <AnomalyIcon kind={anomaly.kind} aria-hidden>
                  {anomaly.kind === 'drop' ? '↓' : '↑'}
                </AnomalyIcon>
                <AnomalyText>{describeAnomaly(anomaly)}</AnomalyText>
              </AnomalyCard>
            ))}
          </AnalyzeSection>
        ))}
      {total === 0 ? <AnalyzeEmpty>No anomalies above the threshold.</AnalyzeEmpty> : null}
    </AnalyzePanelRoot>
  );
}
