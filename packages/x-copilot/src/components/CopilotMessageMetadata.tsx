'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { type ChatMessage, type ChatSuggestion, useMessageContext } from '@mui/x-chat-headless';

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
    // A/B-test correlation + feedback fields. Set on every assistant message
    // the backend emits when A/B testing is enabled. `abPairId` groups the two
    // sibling messages; `abVariant` labels each ('A' or 'B'). The footer / A/B
    // tabs use these to POST feedback and to keep the picked side highlighted.
    // `userFeedback` / `userAbChoice` survive the persistence round-trip so the
    // chosen state stays steady on reload.
    abPairId?: string;
    abVariant?: 'A' | 'B';
    responseId?: string;
    userFeedback?: 'positive' | 'negative';
    userAbChoice?: 'A' | 'B';
  }
}

const Card = styled('div', {
  name: 'MuiCopilotMessageMetadata',
  slot: 'Root',
})(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(0.25, 0.5),
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  background: theme.alpha((theme.vars || theme).palette.text.primary, 0.04),
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
}));

const Table = styled('table', {
  name: 'MuiCopilotMessageMetadata',
  slot: 'Table',
})({
  borderCollapse: 'collapse',
  width: '100%',
});

const Row = styled('tr', {
  name: 'MuiCopilotMessageMetadata',
  slot: 'Row',
})({
  fontVariantNumeric: 'tabular-nums',
});

const Label = styled('td', {
  name: 'MuiCopilotMessageMetadata',
  slot: 'Label',
})(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  paddingRight: theme.spacing(1),
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
  width: '1%',
}));

const Value = styled('td', {
  name: 'MuiCopilotMessageMetadata',
  slot: 'Value',
})(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  wordBreak: 'break-all',
}));

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

export interface CopilotMessageMetadataProps {
  /**
   * The assistant message whose metadata should be rendered. Falls back to the
   * surrounding `MessageContext` when omitted (the default when mounted inside a
   * chat message).
   */
  message?: ChatMessage | null;
  /** Class name applied to the root element (e.g. the panel's `metadata` class hook). */
  className?: string;
}

/**
 * Generic, host-agnostic per-message metadata card. Renders the
 * model / cost / latency / suggestions read off `message.metadata`, behind the
 * `?expose-metadata=1` URL flag.
 */
function CopilotMessageMetadata(props: CopilotMessageMetadataProps) {
  const ctx = useMessageContext();
  const message = props.message !== undefined ? props.message : ctx.message;
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

  const hasAnyMetadataRow =
    hasModel ||
    hasCost ||
    hasElapsedTime ||
    hasSuggestionsModel ||
    hasSuggestionsCost ||
    hasSuggestionsRows;
  if (!hasAnyMetadataRow || !exposeMetadata) {
    return null;
  }

  return (
    <Card className={props.className}>
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
  );
}

export { CopilotMessageMetadata };
