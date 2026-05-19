'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useMessageContext } from '@mui/x-chat-headless';

// Augment the chat-headless message metadata shape so `message.metadata.modelId`
// and `message.metadata.costUsd` are visible to TypeScript. The backend emits
// these fields via a `message-metadata` stream frame at the end of every
// Copilot response. BYOK requests carry `costUsd: null`.
declare module '@mui/x-chat-headless/types' {
  interface ChatMessageMetadata {
    modelId?: string | null;
    costUsd?: number | null;
  }
}

const Disclosure = styled('details', {
  name: 'MuiDataGrid',
  slot: 'CopilotMessageMetadata',
})({
  marginTop: vars.spacing(0.5),
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
  '& > summary': {
    cursor: 'pointer',
    listStyle: 'none',
    userSelect: 'none',
    color: vars.colors.foreground.accent,
    fontWeight: vars.typography.fontWeight.medium,
    '&::-webkit-details-marker': { display: 'none' },
  },
});

const Body = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing(0.25),
  marginTop: vars.spacing(0.5),
});

const Row = styled('div')({
  display: 'flex',
  gap: vars.spacing(0.5),
  fontVariantNumeric: 'tabular-nums',
});

const Label = styled('span')({
  color: vars.colors.foreground.muted,
  minWidth: 56,
});

const Value = styled('span')({
  color: vars.colors.foreground.base,
  wordBreak: 'break-all',
});

function formatCost(costUsd: number): string {
  if (costUsd === 0) {
    return '$0.00';
  }
  // 4 decimals for sub-cent precision; trim trailing zeros down to at least 2.
  const fixed = costUsd.toFixed(4);
  const trimmed = fixed.replace(/0+$/, '').replace(/\.$/, '');
  const dotIndex = trimmed.indexOf('.');
  if (dotIndex === -1 || trimmed.length - dotIndex - 1 < 2) {
    return `$${costUsd.toFixed(2)}`;
  }
  return `$${trimmed}`;
}

function CopilotMessageMetadata() {
  const ctx = useMessageContext();
  const message = ctx.message;
  if (!message || message.role !== 'assistant') {
    return null;
  }
  const metadata = message.metadata;
  const modelId = metadata?.modelId ?? null;
  const costUsd = metadata?.costUsd;
  const hasModel = typeof modelId === 'string' && modelId.length > 0;
  const hasCost = typeof costUsd === 'number';
  if (!hasModel && !hasCost) {
    return null;
  }

  return (
    <Disclosure>
      <summary>Metadata</summary>
      <Body>
        {hasModel && (
          <Row>
            <Label>Model</Label>
            <Value>{modelId}</Value>
          </Row>
        )}
        {hasCost && (
          <Row>
            <Label>Cost</Label>
            <Value>{formatCost(costUsd)}</Value>
          </Row>
        )}
      </Body>
    </Disclosure>
  );
}

export { CopilotMessageMetadata };
