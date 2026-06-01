'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { detectAnomalies } from '../analysis';
import type { AnnotationSpec } from '../annotations/types';
import { chartCopilotClasses } from './chartCopilotClasses';

export interface ProactiveAnomalyChipSeries {
  id: string;
  label: string;
  data: (number | null)[];
}

export interface ProactiveAnomalyChipProps {
  /** The resolved value series; the first is scanned for anomalies. */
  series: ProactiveAnomalyChipSeries[];
  /** The x-axis categories, used to describe where the anomaly is. */
  categories: (string | number | Date | null)[];
  /** Existing annotations, to avoid re-suggesting an already-marked anomaly. */
  annotations?: Record<string, AnnotationSpec>;
  /** Called when the user accepts the suggestion. */
  onMark(spec: AnnotationSpec): void;
}

const ChipRoot = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'ProactiveChip',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  fontSize: theme.typography.pxToRem(12),
}));

const ChipButton = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: theme.typography.pxToRem(12),
  color: (theme.vars ?? theme).palette.primary.main,
  '&:hover': { textDecoration: 'underline' },
}));

const ChipDismiss = styled(ChipButton)(({ theme }) => ({
  color: (theme.vars ?? theme).palette.text.secondary,
}));

/** Whether the primary series already has an anomaly marker. */
function hasAnomalyMarker(annotations: Record<string, AnnotationSpec> | undefined, target: string) {
  return Object.values(annotations ?? {}).some(
    (a) => a.kind === 'marker' && a.at === 'anomaly' && a.target === target,
  );
}

/**
 * A proactive, dismissible suggestion: when the chart's primary series contains
 * a detected anomaly that is not already marked, offer to annotate it. The
 * detection is deterministic client math (`detectAnomalies`); accepting it emits
 * an annotation through the normal pipeline, so it gets a receipt and an undo.
 */
export function ProactiveAnomalyChip(props: ProactiveAnomalyChipProps) {
  const { series, categories, annotations, onMark } = props;
  const [dismissedIndex, setDismissedIndex] = React.useState<number | null>(null);

  const primary = series[0];
  const suggestion = React.useMemo(() => {
    if (!primary) {
      return null;
    }
    const anomalies = detectAnomalies(primary.data);
    if (anomalies.length === 0) {
      return null;
    }
    const top = anomalies.reduce((best, a) =>
      Math.abs(a.ratio) > Math.abs(best.ratio) ? a : best,
    );
    return { index: top.index, kind: top.kind };
  }, [primary]);

  if (!primary || !suggestion) {
    return null;
  }
  if (suggestion.index === dismissedIndex || hasAnomalyMarker(annotations, primary.id)) {
    return null;
  }

  const where = categories[suggestion.index];
  const whereLabel = where instanceof Date ? where.toLocaleDateString() : String(where ?? '');
  const word = suggestion.kind === 'drop' ? 'Drop' : 'Spike';

  return (
    <ChipRoot className={chartCopilotClasses.proactiveChip}>
      <span>
        {word} detected in {primary.label}
        {whereLabel ? ` at ${whereLabel}` : ''} — mark it?
      </span>
      <ChipButton
        type="button"
        onClick={() =>
          onMark({
            id: `anomaly-${primary.id}`,
            kind: 'marker',
            at: 'anomaly',
            target: primary.id,
            text: `${word} in ${primary.label}`,
          })
        }
      >
        Mark
      </ChipButton>
      <ChipDismiss type="button" onClick={() => setDismissedIndex(suggestion.index)}>
        Dismiss
      </ChipDismiss>
    </ChipRoot>
  );
}
