'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import {
  ChatMessage,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
} from '@mui/x-chat';
import { useChatStore } from '@mui/x-chat-headless';
import type { ChatMessage as HeadlessChatMessage } from '@mui/x-chat-headless';
import type { ToolPartSlots } from '@mui/x-chat-headless';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { CopilotStreamingIndicator } from './CopilotStreamingIndicator';
import { CopilotMessageMetadata } from './CopilotMessageMetadata';
import { useCopilotFeedback } from './CopilotMessageFooter';

/**
 * Tabbed wrapper rendered in place of an A/B pair's two sibling messages.
 *
 * Behaviour:
 *  - Two tabs ("A" / "B"), each labelled with the variant's model arm so the
 *    user has SOMETHING to differentiate them at a glance.
 *  - Clicking a tab calls `apiRef.current.copilot.switchToVariant(messageId)`
 *    which runs `history.undo` on the previously-applied variant and replays
 *    the picked variant's cached envelope. The grid swaps state instantly.
 *  - The first tab click also POSTs `kind: 'ab-pick'` feedback through the
 *    `CopilotFeedbackProvider`. Subsequent clicks switch preview only.
 *  - The picked variant's `userAbChoice` is patched onto BOTH sibling messages
 *    (via `ChatStore.updateMessage`) so the choice round-trips through
 *    localStorage and tabs stay sticky across reloads.
 *  - During streaming, the not-yet-finished variant's tab is enabled but the
 *    underlying message renders its own streaming indicator (the
 *    `ChatMessageContent` is variant-aware).
 *
 * The card replaces the two separate sibling messages that would otherwise
 * stack vertically in the conversation — looks much cleaner and matches the
 * mental model of "two candidate answers, pick one".
 */

const Card = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantCard',
})({
  marginTop: vars.spacing(1),
  marginBottom: vars.spacing(1),
  border: `1px solid ${vars.colors.border.base}`,
  borderRadius: vars.radius.base,
  overflow: 'hidden',
  background: vars.colors.background.base,
});

const TabBar = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantTabBar',
})({
  display: 'flex',
  borderBottom: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.overlay,
});

const TabButton = styled('button', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantTab',
})({
  appearance: 'none',
  cursor: 'pointer',
  flex: 1,
  padding: vars.spacing(1, 1.25),
  background: 'transparent',
  border: 'none',
  borderRight: `1px solid ${vars.colors.border.base}`,
  color: vars.colors.foreground.muted,
  font: vars.typography.font.small,
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.spacing(0.25),
  transition: 'background 120ms ease, color 120ms ease',
  ':last-child': {
    borderRight: 'none',
  },
  ':hover': {
    background: vars.colors.background.base,
    color: vars.colors.foreground.base,
  },
  '&[aria-selected="true"]': {
    background: vars.colors.background.base,
    color: vars.colors.foreground.base,
    boxShadow: `inset 0 -2px 0 ${vars.colors.foreground.accent}`,
  },
  '&[disabled]': {
    cursor: 'default',
    opacity: 0.65,
  },
});

const TabLabel = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantTabLabel',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  fontWeight: 600,
});

const TabSubLabel = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantTabSubLabel',
})({
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
  textTransform: 'lowercase',
});

const TabStats = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantTabStats',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  marginTop: vars.spacing(0.25),
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

const TabStat = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantTabStat',
})({
  display: 'inline-flex',
  alignItems: 'center',
  // Subtle visual separator between price and latency.
  ':not(:last-of-type)::after': {
    content: '"·"',
    marginLeft: vars.spacing(0.5),
    opacity: 0.6,
  },
});

const Chip = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantChip',
})({
  display: 'inline-flex',
  alignItems: 'center',
  padding: vars.spacing(0, 0.5),
  borderRadius: vars.radius.base,
  background: vars.colors.background.overlay,
  color: vars.colors.foreground.muted,
  font: vars.typography.font.small,
});

const Body = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantBody',
})({
  padding: vars.spacing(1),
});

const CommitBar = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantCommitBar',
})({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing(0.75),
  padding: vars.spacing(0.75, 1),
  borderTop: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.overlay,
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

const CommitButton = styled('button', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantCommitButton',
})({
  appearance: 'none',
  cursor: 'pointer',
  padding: vars.spacing(0.5, 1),
  borderRadius: vars.radius.base,
  border: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.base,
  color: vars.colors.foreground.base,
  font: vars.typography.font.small,
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  transition: 'background 120ms ease, border-color 120ms ease',
  ':hover': {
    background: vars.colors.background.overlay,
    borderColor: vars.colors.foreground.muted,
  },
  '&[disabled]': {
    cursor: 'default',
    opacity: 0.65,
  },
});

const CommitBadge = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantCommitBadge',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  padding: vars.spacing(0.25, 0.5),
  borderRadius: vars.radius.base,
  border: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.base,
  color: vars.colors.foreground.base,
  font: vars.typography.font.small,
});

function shortenModel(modelId: string | null | undefined): string {
  if (!modelId) {
    return 'unknown';
  }
  // Trim the provider prefix when present (e.g. `anthropic/claude-haiku-4-5`
  // → `claude-haiku-4-5`) so the tab stays compact on narrow panels.
  const slash = modelId.indexOf('/');
  return slash >= 0 ? modelId.slice(slash + 1) : modelId;
}

function formatCost(costUsd: number | null | undefined): string | null {
  if (typeof costUsd !== 'number' || Number.isNaN(costUsd)) {
    return null;
  }
  if (costUsd === 0) {
    return '$0';
  }
  // Sub-cent precision when the cost is small, two decimals otherwise.
  if (costUsd < 0.01) {
    const fixed = costUsd.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
    return `$${fixed}`;
  }
  return `$${costUsd.toFixed(2)}`;
}

interface VariantTabProps {
  variant: 'A' | 'B';
  selected: boolean;
  message: HeadlessChatMessage;
  isWinner: boolean;
  isLoser: boolean;
  onClick: () => void;
}

function VariantTab({ variant, selected, message, isWinner, isLoser, onClick }: VariantTabProps) {
  const modelLabel = shortenModel(message.metadata?.modelArmId ?? message.metadata?.modelId);
  const promptVersion = message.metadata?.promptVersion;
  const isStreaming = message.status === 'streaming';
  // Per-variant headline stats — cost + latency. Both arrive on the
  // `finish` chunk's `messageMetadata`, so they're set as soon as the
  // variant's stream completes (the tab updates without a separate
  // round-trip). Skipped when the value is missing or while streaming.
  const costLabel = formatCost(message.metadata?.costUsd);
  const elapsedTime = message.metadata?.elapsedTime;
  const latencyLabel =
    typeof elapsedTime === 'string' && elapsedTime.length > 0 ? elapsedTime : null;
  const hasStats = !isStreaming && (costLabel !== null || latencyLabel !== null);
  return (
    <TabButton
      type="button"
      aria-selected={selected}
      onClick={onClick}
      disabled={false}
      title={`Variant ${variant} • ${modelLabel}${promptVersion ? ` • prompt ${promptVersion}` : ''}${costLabel ? ` • ${costLabel}` : ''}${latencyLabel ? ` • ${latencyLabel}` : ''}`}
    >
      <TabLabel>
        Variant {variant}
        {isWinner && <Chip aria-label="Chosen variant">✓ chosen</Chip>}
        {isLoser && <Chip>not picked</Chip>}
        {isStreaming && <Chip>streaming…</Chip>}
      </TabLabel>
      <TabSubLabel>
        {modelLabel}
        {promptVersion ? ` · ${promptVersion}` : ''}
      </TabSubLabel>
      {hasStats && (
        <TabStats aria-label="Variant stats">
          {costLabel !== null && <TabStat title="Total cost">{costLabel}</TabStat>}
          {latencyLabel !== null && <TabStat title="Response latency">{latencyLabel}</TabStat>}
        </TabStats>
      )}
    </TabButton>
  );
}

interface CopilotAbVariantTabsProps {
  variantA: HeadlessChatMessage;
  variantB: HeadlessChatMessage;
  toolSlots: Record<string, Partial<ToolPartSlots>>;
}

export function CopilotAbVariantTabs({ variantA, variantB, toolSlots }: CopilotAbVariantTabsProps) {
  const store = useChatStore();
  const apiRef = useGridApiContext();
  const submitFeedback = useCopilotFeedback();

  const abPairId = variantA.metadata?.abPairId ?? variantB.metadata?.abPairId ?? '';
  const persistedChoice =
    variantA.metadata?.userAbChoice ?? variantB.metadata?.userAbChoice ?? undefined;

  // Local UI state: which tab is currently visible. Initialises to the
  // persisted user choice (so reload lands on the picked variant) or 'A'
  // otherwise. The executor always previews variant A first while
  // streaming, so 'A' is the safe default.
  const [activeVariant, setActiveVariant] = React.useState<'A' | 'B'>(persistedChoice ?? 'A');
  const [submitting, setSubmitting] = React.useState(false);

  // Re-sync if the user reloads with a different persisted choice.
  React.useEffect(() => {
    if (persistedChoice && persistedChoice !== activeVariant) {
      setActiveVariant(persistedChoice);
    }
    // We only want to react to *new* persisted values, not every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistedChoice]);

  // Tabs are **preview-only** — clicking a tab swaps the grid state to
  // that variant's cached envelope but does NOT commit the choice. The
  // commit happens via the explicit "Use this answer" button below, so
  // the user can flip through both variants on the grid before deciding
  // which one to mark as the winner for analytics.
  const handlePreview = React.useCallback(
    (target: 'A' | 'B') => {
      if (target === activeVariant) {
        return;
      }
      const targetMessage = target === 'A' ? variantA : variantB;
      try {
        apiRef.current?.copilot?.switchToVariant?.(targetMessage.id);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[Copilot] switchToVariant failed:', err);
      }
      setActiveVariant(target);
    },
    [activeVariant, variantA, variantB, apiRef],
  );

  // Explicit commit: POST `kind: 'ab-pick'` feedback and persist the
  // choice on both sibling messages so analytics (the
  // `copilot-ab-winner` scorer + `ab_user_choice` on `copilot_request`)
  // can track which variant the user actually selected. Idempotent —
  // re-clicking the same picked variant is a no-op; picking the other
  // variant overwrites the previous choice and re-fires feedback.
  const handlePick = React.useCallback(
    async (target: 'A' | 'B') => {
      if (target === persistedChoice) {
        return;
      }
      const targetMessage = target === 'A' ? variantA : variantB;
      const otherMessage = target === 'A' ? variantB : variantA;
      const chosenResponseId = targetMessage.metadata?.responseId;
      const otherResponseId = otherMessage.metadata?.responseId;
      if (!chosenResponseId || !otherResponseId || !abPairId) {
        return;
      }
      setSubmitting(true);
      try {
        if (submitFeedback) {
          await submitFeedback({
            kind: 'ab-pick',
            abPairId,
            chosenResponseId,
            otherResponseId,
            chosenVariant: target,
          });
        }
        const patch = { userAbChoice: target } as const;
        store.updateMessage(variantA.id, {
          metadata: { ...variantA.metadata, ...patch },
        });
        store.updateMessage(variantB.id, {
          metadata: { ...variantB.metadata, ...patch },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[Copilot] ab-pick feedback failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
    [persistedChoice, variantA, variantB, abPairId, submitFeedback, store],
  );

  const activeMessage = activeVariant === 'A' ? variantA : variantB;
  const winnerVariant = persistedChoice;

  const activeIsWinner = winnerVariant === activeVariant;
  const bothStreamed = variantA.status !== 'streaming' && variantB.status !== 'streaming';

  return (
    <Card>
      <TabBar role="tablist" aria-label="A/B test variants">
        <VariantTab
          variant="A"
          selected={activeVariant === 'A'}
          message={variantA}
          isWinner={winnerVariant === 'A'}
          isLoser={winnerVariant === 'B'}
          onClick={() => handlePreview('A')}
        />
        <VariantTab
          variant="B"
          selected={activeVariant === 'B'}
          message={variantB}
          isWinner={winnerVariant === 'B'}
          isLoser={winnerVariant === 'A'}
          onClick={() => handlePreview('B')}
        />
      </TabBar>
      <Body role="tabpanel" aria-labelledby={`copilot-ab-tab-${activeVariant}`}>
        <ChatMessageGroup messageId={activeMessage.id}>
          <ChatMessage messageId={activeMessage.id}>
            <ChatMessageContent
              afterContent={
                <React.Fragment>
                  <CopilotStreamingIndicator />
                  <CopilotMessageMetadata />
                </React.Fragment>
              }
              partProps={{
                tool: {
                  toolSlots,
                },
              }}
            />
            <ChatMessageMeta />
          </ChatMessage>
        </ChatMessageGroup>
      </Body>
      {bothStreamed && (
        <CommitBar>
          {winnerVariant ? (
            <React.Fragment>
              <CommitBadge>✓ Selected Variant {winnerVariant}</CommitBadge>
              {!activeIsWinner && (
                <CommitButton
                  type="button"
                  onClick={() => handlePick(activeVariant)}
                  disabled={submitting}
                  title={`Replace your pick with Variant ${activeVariant}`}
                >
                  Switch pick to {activeVariant}
                </CommitButton>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>Pick the answer that worked better:</span>
              <CommitButton
                type="button"
                onClick={() => handlePick(activeVariant)}
                disabled={submitting}
                title={`Record Variant ${activeVariant} as the winner`}
              >
                {submitting ? 'Recording…' : `Use Variant ${activeVariant}`}
              </CommitButton>
            </React.Fragment>
          )}
        </CommitBar>
      )}
    </Card>
  );
}
