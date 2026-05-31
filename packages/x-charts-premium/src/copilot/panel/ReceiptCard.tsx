'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import type { ChatMessage } from '@mui/x-chat-headless';
import type { ChartCopilotFeature, ReceiptClause } from '../history';
import { chartCopilotClasses } from './chartCopilotClasses';
import { useChartsCopilotControls } from './ChartsCopilotProvider';

export interface ReceiptCardProps {
  /** The assistant message whose receipt should be rendered. */
  message: ChatMessage;
}

const FEATURE_LABELS: Record<ChartCopilotFeature, string> = {
  ask: 'Created',
  refine: 'Refined',
  annotate: 'Annotated',
  explain: 'Explained',
  reshape: 'Reshaped',
};

const ReceiptRoot = styled('div', {
  name: 'MuiChartCopilot',
  slot: 'Receipt',
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}));

const ReceiptLabel = styled('span')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(11),
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars ?? theme).palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
}));

const ClauseChip = styled('span', {
  name: 'MuiChartCopilot',
  slot: 'ReceiptClause',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.25, 0.75),
  borderRadius: theme.shape.borderRadius,
  fontSize: theme.typography.pxToRem(12),
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  color: (theme.vars ?? theme).palette.text.primary,
}));

const UndoButton = styled('button')(({ theme }) => ({
  marginLeft: 'auto',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: theme.spacing(0.25, 0.5),
  font: 'inherit',
  fontSize: theme.typography.pxToRem(12),
  color: (theme.vars ?? theme).palette.primary.main,
  '&:hover': { textDecoration: 'underline' },
}));

/** Renders the clause chips for a receipt (shared by the card and step history). */
export function ReceiptClauseList(props: { clauses: ReceiptClause[] }) {
  return (
    <React.Fragment>
      {props.clauses.map((clause) => (
        <ClauseChip key={clause.id} className={chartCopilotClasses.receiptClause}>
          {clause.label}
        </ClauseChip>
      ))}
    </React.Fragment>
  );
}

/**
 * The per-turn receipt shown under an assistant message (PRD "Receipt, not a
 * black box"): the editable summary of what the AI did, plus a per-step undo.
 * Wired through the panel's `metadataCard` slot; reads the step for this message
 * from the history store. Renders nothing for turns that changed no spec.
 */
export function ReceiptCard(props: ReceiptCardProps) {
  const { message } = props;
  const { history } = useChartsCopilotControls();

  const step = history?.getStepByMessageId(message.id);
  if (!step || step.clauses.length === 0) {
    return null;
  }

  return (
    <ReceiptRoot className={chartCopilotClasses.receipt}>
      <ReceiptLabel>{FEATURE_LABELS[step.feature]}</ReceiptLabel>
      <ReceiptClauseList clauses={step.clauses} />
      <UndoButton type="button" onClick={() => history?.undo(step.id)}>
        Undo
      </UndoButton>
    </ReceiptRoot>
  );
}
