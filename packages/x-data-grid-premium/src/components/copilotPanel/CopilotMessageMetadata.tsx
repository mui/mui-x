'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { ChatSuggestions } from '@mui/x-chat';
import { type ChatSuggestion, useMessageContext, useMessageIds } from '@mui/x-chat-headless';

// Augment the chat-headless message metadata shape so `message.metadata.modelId`
// / `costUsd` / `elapsedTime` / `suggestions` are visible to TypeScript. The
// backend emits these fields via a `message-metadata` stream frame at the end
// of every Copilot response. BYOK requests carry `costUsd: null`. The optional
// `suggestions` array carries follow-up prompts the model offered.
declare module '@mui/x-chat-headless/types' {
  interface ChatMessageMetadata {
    modelId?: string | null;
    costUsd?: number | null;
    elapsedTime?: string | null;
    suggestions?: Array<ChatSuggestion | string> | null;
    suggestionsModelId?: string | null;
    suggestionsCostUsd?: number | null;
  }
}

const Card = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotMessageMetadata',
})({
  marginTop: vars.spacing(1),
  padding: vars.spacing(0.25, 0.5),
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: vars.radius.base,
  border: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.overlay,
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

const Table = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
});

const Row = styled('tr')({
  fontVariantNumeric: 'tabular-nums',
});

const Label = styled('td')({
  color: vars.colors.foreground.muted,
  paddingRight: vars.spacing(1),
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
  width: '1%',
});

const Value = styled('td')({
  color: vars.colors.foreground.base,
  wordBreak: 'break-all',
});

const SuggestionsBlock = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotMessageSuggestions',
})({
  marginTop: vars.spacing(1),
  width: '100%',
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

// Behind a URL flag — the metadata table exposes model id, raw cost in USD,
// latency, and the suggestion-generation model. Useful for debugging /
// internal demos but noisy for end users. Reading via a React hook keeps the
// value stable across re-renders and SSR-safe (window is undefined on the
// server).
function useExposeMetadata(): boolean {
  return React.useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return new URLSearchParams(window.location.search).get('expose-metadata') === '1';
  }, []);
}

function CopilotMessageMetadata() {
  const ctx = useMessageContext();
  const message = ctx.message;
  const messageIds = useMessageIds();
  const exposeMetadata = useExposeMetadata();
  if (!message || message.role !== 'assistant') {
    return null;
  }
  const metadata = message.metadata;
  const modelId = metadata?.modelId ?? null;
  const costUsd = metadata?.costUsd;
  const elapsedTime = metadata?.elapsedTime;
  const suggestions = metadata?.suggestions;
  const suggestionsModelId = metadata?.suggestionsModelId ?? null;
  const suggestionsCostUsd = metadata?.suggestionsCostUsd;
  const hasModel = typeof modelId === 'string' && modelId.length > 0;
  const hasCost = typeof costUsd === 'number';
  const hasElapsedTime = typeof elapsedTime === 'string' && elapsedTime.length > 0;
  const hasSuggestionsModel =
    typeof suggestionsModelId === 'string' && suggestionsModelId.length > 0;
  const hasSuggestionsCost = typeof suggestionsCostUsd === 'number';
  const suggestionsList = Array.isArray(suggestions) ? suggestions : [];
  const hasSuggestionsRows = suggestionsList.length > 0;
  // Only surface follow-up suggestions on the most recent assistant message
  // so stale suggestions from earlier turns don't accumulate in the thread.
  const isLastMessage = messageIds[messageIds.length - 1] === message.id;
  const hasSuggestions = isLastMessage && hasSuggestionsRows;

  const hasAnyMetadataRow =
    hasModel ||
    hasCost ||
    hasElapsedTime ||
    hasSuggestionsModel ||
    hasSuggestionsCost ||
    hasSuggestionsRows;
  if (!hasAnyMetadataRow && !hasSuggestions) {
    return null;
  }

  return (
    <React.Fragment>
      {exposeMetadata && hasAnyMetadataRow && (
        <Card>
          <Table>
            <tbody>
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
              {hasElapsedTime && (
                <Row>
                  <Label>Latency</Label>
                  <Value>{elapsedTime}</Value>
                </Row>
              )}
              {hasSuggestionsModel && (
                <Row>
                  <Label>Sug. model</Label>
                  <Value>{suggestionsModelId}</Value>
                </Row>
              )}
              {hasSuggestionsCost && (
                <Row>
                  <Label>Sug. cost</Label>
                  <Value>{formatCost(suggestionsCostUsd)}</Value>
                </Row>
              )}
              {suggestionsList.map((raw, index) => {
                const text = typeof raw === 'string' ? raw : (raw.label ?? raw.value);
                return (
                  <Row key={`sug-${index}`}>
                    <Label>Sug. {index + 1}</Label>
                    <Value>{text}</Value>
                  </Row>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}
      {hasSuggestions && (
        <SuggestionsBlock>
          <ChatSuggestions
            suggestions={suggestionsList.slice(0, 3)}
            autoSubmit
            alwaysVisible
          />
        </SuggestionsBlock>
      )}
    </React.Fragment>
  );
}

export { CopilotMessageMetadata };
