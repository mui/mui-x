'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import type { ChartFocusState } from '../chartFocusState';
import { chartCopilotClasses } from './chartCopilotClasses';

export interface FocusBreadcrumbProps {
  /** The current Focus view state. */
  focus: ChartFocusState;
  // Resolves a series field to its display label (for the highlight chip).
  seriesLabel?: (seriesId: string) => string;
  /** Called when the user clears the focus. */
  onReset(): void;
}

const BreadcrumbRoot = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'FocusBreadcrumb',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(0.25, 1),
  fontSize: theme.typography.pxToRem(12),
  color: (theme.vars ?? theme).palette.text.secondary,
}));

const ResetButton = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: theme.typography.pxToRem(12),
  color: (theme.vars ?? theme).palette.primary.main,
  '&:hover': { textDecoration: 'underline' },
}));

/**
 * Shows the current Focus view (zoom window and/or highlighted series) above the
 * chart, with a reset (PRD "focus breadcrumb"). Renders nothing when no focus is
 * active. Focus is ephemeral view state, so reset here is independent of the
 * edit step-history / undo.
 */
export function FocusBreadcrumb(props: FocusBreadcrumbProps) {
  const { focus, seriesLabel, onReset } = props;

  if (!focus.zoom && !focus.highlight) {
    return null;
  }

  const parts: string[] = [];
  if (focus.zoom) {
    parts.push(`Zoomed: ${focus.zoom.from}–${focus.zoom.to}`);
  }
  if (focus.highlight) {
    const label = seriesLabel ? seriesLabel(focus.highlight.seriesId) : focus.highlight.seriesId;
    parts.push(`Highlighting: ${label}`);
  }

  return (
    <BreadcrumbRoot className={chartCopilotClasses.focusBreadcrumb}>
      <span>{parts.join(' · ')}</span>
      <ResetButton type="button" onClick={onReset}>
        Reset view
      </ResetButton>
    </BreadcrumbRoot>
  );
}
