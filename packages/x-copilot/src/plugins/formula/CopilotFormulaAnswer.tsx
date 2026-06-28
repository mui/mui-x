'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMessage } from '@mui/x-chat-headless';
import { findToolPartByCallId } from '../core';
import type { FormulaResult, FormulaScope, FormulaValue } from '../../formula-engine';

const PRIVACY_TOOLTIP =
  'All calculations happen locally in your browser. ' +
  'The AI returns a formula; your raw row data is never sent externally.';

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  );
}

interface CopilotFormulaAnswerOwnerState {
  messageId: string;
  toolName: string;
  toolCallId: string;
  state: string;
}

interface CopilotFormulaAnswerProps {
  className?: string;
  ownerState?: CopilotFormulaAnswerOwnerState;
}

interface FormulaToolOutput {
  title: string;
  formula: string;
  scope: FormulaScope;
  result: FormulaResult;
}

const Card = styled('div', {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'Root',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  width: '100%',
  padding: theme.spacing(1),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  background: (theme.vars || theme).palette.background.paper,
}));

const CardError = styled(Card, {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'ErrorRoot',
})(({ theme }) => ({
  borderColor: (theme.vars || theme).palette.error.main,
}));

const Header = styled('div', {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'Header',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(0.5),
}));

const Title = styled('div', {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'Title',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
}));

const PrivacyBadge = styled('span', {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'PrivacyBadge',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
  cursor: 'help',
  '&:hover, &:focus-visible': {
    color: (theme.vars || theme).palette.text.primary,
  },
}));

const Value = styled('div', {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'Value',
})(({ theme }) => ({
  ...theme.typography.h6,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
}));

const DetailsToggle = styled('button', {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'DetailsToggle',
})(({ theme }) => ({
  appearance: 'none',
  background: 'none',
  border: 0,
  padding: 0,
  marginTop: theme.spacing(0.25),
  textAlign: 'left',
  cursor: 'pointer',
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  '&:hover': {
    color: (theme.vars || theme).palette.text.primary,
  },
}));

const Details = styled('div', {
  name: 'MuiCopilotFormulaAnswer',
  slot: 'Details',
})(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.75),
  borderRadius: theme.shape.borderRadius,
  background: (theme.vars || theme).palette.background.paper,
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

function formatScalar(value: FormulaValue): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (!Number.isFinite(value)) {
    return '—';
  }
  const isInt = Number.isInteger(value);
  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: isInt ? 0 : 2,
  });
  return formatter.format(value);
}

function CopilotFormulaAnswer(props: CopilotFormulaAnswerProps) {
  const { className, ownerState } = props;
  const messageId = ownerState?.messageId;
  const toolCallId = ownerState?.toolCallId ?? '';
  const message = useMessage(messageId ?? '');
  const toolPart = findToolPartByCallId(message?.parts, toolCallId);
  const invocationState = toolPart?.toolInvocation?.state ?? ownerState?.state;
  const output = toolPart?.toolInvocation?.output as FormulaToolOutput | undefined;
  const [expanded, setExpanded] = React.useState(false);

  if (invocationState !== 'output-available' || !output) {
    return null;
  }

  const header = (
    <Header>
      <Title>{output.title}</Title>
      <PrivacyBadge tabIndex={0} role="img" aria-label={PRIVACY_TOOLTIP} title={PRIVACY_TOOLTIP}>
        <InfoIcon />
      </PrivacyBadge>
    </Header>
  );

  if (!output.result.ok) {
    return (
      <CardError className={className}>
        {header}
        <Value>Could not compute</Value>
        <DetailsToggle type="button" onClick={() => setExpanded((v) => !v)}>
          {expanded ? '▾' : '▸'} {output.result.reason}
        </DetailsToggle>
        {expanded && (
          <Details>
            Formula: {output.formula}
            {'\n'}Scope: {output.scope}
          </Details>
        )}
      </CardError>
    );
  }

  const { value, rowCount } = output.result;
  const scopeLabel = output.scope === 'all' ? 'all rows' : 'filtered rows';

  return (
    <Card className={className}>
      {header}
      <Value>{formatScalar(value)}</Value>
      <DetailsToggle type="button" onClick={() => setExpanded((v) => !v)}>
        {expanded ? '▾' : '▸'} {output.formula} · {rowCount} {scopeLabel}
      </DetailsToggle>
      {expanded && (
        <Details>
          Formula: {output.formula}
          {'\n'}Scope: {output.scope}
          {'\n'}Rows considered: {rowCount}
        </Details>
      )}
    </Card>
  );
}

export { CopilotFormulaAnswer };
