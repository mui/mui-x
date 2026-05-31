'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { chartCopilotClasses } from './chartCopilotClasses';
import { ReceiptClauseList } from './ReceiptCard';
import { useChartsCopilotControls } from './ChartsCopilotProvider';

const StepHistoryRoot = styled('details', {
  name: 'MuiChartCopilot',
  slot: 'StepHistory',
})(({ theme }) => ({
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  padding: theme.spacing(0.5, 1),
}));

const StepHistorySummary = styled('summary')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  fontSize: theme.typography.pxToRem(12),
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars ?? theme).palette.text.secondary,
  listStyle: 'none',
}));

const ResetButton = styled('button')(({ theme }) => ({
  marginLeft: 'auto',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: theme.typography.pxToRem(12),
  color: (theme.vars ?? theme).palette.primary.main,
  '&:hover': { textDecoration: 'underline' },
}));

const StepRow = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'StepHistoryItem',
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0),
}));

const StepUndo = styled('button')(({ theme }) => ({
  marginLeft: 'auto',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: theme.typography.pxToRem(12),
  color: (theme.vars ?? theme).palette.primary.main,
  '&:hover': { textDecoration: 'underline' },
}));

/**
 * The visible, reversible step history (PRD "visible + reversible … accrete as
 * a step history"). Each accepted turn is a row with its receipt clauses and a
 * per-step undo; "Reset to original" rewinds the chart to its pre-history spec.
 * Reads the history store from context; renders nothing until a step exists.
 */
export function StepHistory() {
  const { history } = useChartsCopilotControls();

  if (!history || history.steps.length === 0) {
    return null;
  }

  return (
    <StepHistoryRoot className={chartCopilotClasses.stepHistory}>
      <StepHistorySummary>
        <span>History ({history.steps.length})</span>
        <ResetButton
          type="button"
          onClick={(event) => {
            event.preventDefault();
            history.reset();
          }}
        >
          Reset to original
        </ResetButton>
      </StepHistorySummary>
      {history.steps.map((step) => (
        <StepRow key={step.id} className={chartCopilotClasses.stepHistoryItem}>
          <ReceiptClauseList clauses={step.clauses} />
          <StepUndo type="button" onClick={() => history.undo(step.id)}>
            Undo
          </StepUndo>
        </StepRow>
      ))}
    </StepHistoryRoot>
  );
}
