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
import { useChatStore, useMessageIds } from '@mui/x-chat-headless';
import type { ChatMessage as HeadlessChatMessage , ToolPartSlots } from '@mui/x-chat-headless';
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

const BodyPlaceholder = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotAbVariantBodyPlaceholder',
})({
  padding: vars.spacing(1.5),
  textAlign: 'center',
  color: vars.colors.foreground.muted,
  font: vars.typography.font.small,
  fontStyle: 'italic',
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
  message: HeadlessChatMessage | undefined;
  isWinner: boolean;
  isLoser: boolean;
  onClick: () => void;
}

function VariantTab({ variant, selected, message, isWinner, isLoser, onClick }: VariantTabProps) {
  // Placeholder while the twin variant's stream hasn't started yet.
  // Mounting the tab eagerly (instead of waiting for both responses)
  // gives the user an immediate visual cue that an A/B comparison is in
  // progress and avoids an awkward layout shift mid-stream.
  if (!message) {
    return (
      <TabButton
        type="button"
        aria-selected={selected}
        onClick={onClick}
        disabled
        title={`Variant ${variant} is loading…`}
      >
        <TabLabel>
          Variant {variant}
          <Chip>loading…</Chip>
        </TabLabel>
        <TabSubLabel>waiting for response…</TabSubLabel>
      </TabButton>
    );
  }
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

/**
 * Resolved props consumed by the tabs renderer once the A/B pair has been
 * located. Both call shapes (see {@link CopilotAbVariantTabsProps}) funnel
 * into this internal component so the rendering logic lives in one place.
 */
interface CopilotAbVariantTabsBaseProps {
  /** Shared pair id — known from the leader's preamble before both
   *  variants have streamed. Required so feedback POSTs work even when
   *  one of the variants is still pending. */
  abPairId: string;
  variantA: HeadlessChatMessage | undefined;
  variantB: HeadlessChatMessage | undefined;
  toolSlots: Record<string, Partial<ToolPartSlots>>;
  /**
   * Invoked when the user previews/picks a variant. When provided (the
   * shared-panel slot shape), it replaces the default
   * `apiRef.current.copilot.switchToVariant` call so the host can drive the
   * replay/apply itself.
   * @param {string} messageId The id of the picked variant's message.
   */
  onSwitchVariant?: (messageId: string) => void;
}

/**
 * Current `GridCopilotPanel` call shape: the panel has already located the
 * A/B pair (variant messages + pair id) and supplies them directly, along
 * with the merged tool slots.
 */
interface CopilotAbVariantTabsResolvedProps {
  abPairId: string;
  variantA: HeadlessChatMessage | undefined;
  variantB: HeadlessChatMessage | undefined;
  toolSlots: Record<string, Partial<ToolPartSlots>>;
  message?: undefined;
  onSwitchVariant?: (messageId: string) => void;
}

/**
 * Shared-panel slot shape (`@mui/x-copilot`'s
 * `CopilotChatPanelAbVariantTabsProps`): only the leader assistant message is
 * supplied. The pair id and sibling variants are derived from the chat store,
 * and tool slots fall back to the empty set (the host panel owns slot
 * injection in that mode).
 */
interface CopilotAbVariantTabsMessageProps {
  /** Leader assistant message of the A/B pair (carries `metadata.abPairId`). */
  message: HeadlessChatMessage;
  /**
   * Called when the user switches A/B variant for a message.
   * @param {string} messageId The id of the picked variant's message.
   */
  onSwitchVariant?: (messageId: string) => void;
  abPairId?: undefined;
  variantA?: undefined;
  variantB?: undefined;
  toolSlots?: Record<string, Partial<ToolPartSlots>>;
}

/**
 * Props for {@link CopilotAbVariantTabs}.
 *
 * Supports two call shapes:
 *
 * - The current `GridCopilotPanel` shape
 *   ({@link CopilotAbVariantTabsResolvedProps}), where the panel has already
 *   resolved the A/B pair and passes `abPairId` + `variantA`/`variantB` +
 *   `toolSlots` directly.
 * - The shared panel's `abVariantTabs` slot shape
 *   ({@link CopilotAbVariantTabsMessageProps}), where only the leader
 *   `message` is provided; `abPairId` and the sibling variants are derived
 *   from the chat store (the same store `GridCopilotPanel` reads), and an
 *   optional `onSwitchVariant` callback overrides the default
 *   `apiRef.current.copilot.switchToVariant` behavior.
 */
type CopilotAbVariantTabsProps =
  | CopilotAbVariantTabsResolvedProps
  | CopilotAbVariantTabsMessageProps;

/**
 * Derive an A/B pair (variant A / variant B messages) for `abPairId` by
 * scanning the chat store — the same lookup `GridCopilotPanel`'s
 * `CopilotMessageItem` performs. Used by the shared-panel slot path, which
 * only receives the leader `message`.
 * @param {string | undefined} abPairId The pair id to resolve siblings for.
 * @returns {{ variantA: HeadlessChatMessage | undefined; variantB: HeadlessChatMessage | undefined }} The located sibling variants (each possibly undefined while streaming).
 */
function useAbPairFromStore(abPairId: string | undefined): {
  variantA: HeadlessChatMessage | undefined;
  variantB: HeadlessChatMessage | undefined;
} {
  const store = useChatStore();
  const messageIds = useMessageIds();
  const messagesById = store.state.messagesById;
  return React.useMemo(() => {
    if (!abPairId) {
      return { variantA: undefined, variantB: undefined };
    }
    let variantA: HeadlessChatMessage | undefined;
    let variantB: HeadlessChatMessage | undefined;
    for (const otherId of messageIds) {
      const other = messagesById[otherId];
      if (!other || other.role !== 'assistant' || other.metadata?.abPairId !== abPairId) {
        continue;
      }
      if (other.metadata?.abVariant === 'A' && !variantA) {
        variantA = other;
      } else if (other.metadata?.abVariant === 'B' && !variantB) {
        variantB = other;
      }
      if (variantA && variantB) {
        break;
      }
    }
    return { variantA, variantB };
  }, [abPairId, messageIds, messagesById]);
}

const EMPTY_TOOL_SLOTS: Record<string, Partial<ToolPartSlots>> = {};

/**
 * Tabbed A/B variant card. Accepts either the resolved `GridCopilotPanel`
 * props or the shared-panel `{ message, onSwitchVariant }` slot shape; in the
 * latter mode it resolves the pair from the chat store before delegating to
 * the shared renderer. See {@link CopilotAbVariantTabsProps}.
 */
export function CopilotAbVariantTabs(props: CopilotAbVariantTabsProps) {
  const derivedAbPairId = props.message?.metadata?.abPairId;
  const derivedPair = useAbPairFromStore(props.message ? derivedAbPairId : undefined);

  if (props.message) {
    return (
      <CopilotAbVariantTabsBase
        abPairId={derivedAbPairId ?? ''}
        variantA={derivedPair.variantA}
        variantB={derivedPair.variantB}
        toolSlots={props.toolSlots ?? EMPTY_TOOL_SLOTS}
        onSwitchVariant={props.onSwitchVariant}
      />
    );
  }

  return (
    <CopilotAbVariantTabsBase
      abPairId={props.abPairId}
      variantA={props.variantA}
      variantB={props.variantB}
      toolSlots={props.toolSlots}
      onSwitchVariant={props.onSwitchVariant}
    />
  );
}

function CopilotAbVariantTabsBase({
  abPairId,
  variantA,
  variantB,
  toolSlots,
  onSwitchVariant,
}: CopilotAbVariantTabsBaseProps) {
  const store = useChatStore();
  const apiRef = useGridApiContext();
  const submitFeedback = useCopilotFeedback();

  const persistedChoice =
    variantA?.metadata?.userAbChoice ?? variantB?.metadata?.userAbChoice ?? undefined;

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
  // which one to mark as the winner for analytics. Tab clicks for a
  // variant that hasn't streamed yet just toggle the visible content (no
  // grid swap — there's no cached envelope to replay).
  const handlePreview = React.useCallback(
    (target: 'A' | 'B') => {
      if (target === activeVariant) {
        return;
      }
      const targetMessage = target === 'A' ? variantA : variantB;
      if (targetMessage) {
        try {
          if (onSwitchVariant) {
            // Shared-panel slot mode: the host owns replay/apply.
            onSwitchVariant(targetMessage.id);
          } else {
            apiRef.current?.copilot?.switchToVariant?.(targetMessage.id);
          }
        } catch (err) {

          console.warn('[Copilot] switchToVariant failed:', err);
        }
      }
      setActiveVariant(target);
    },
    [activeVariant, variantA, variantB, apiRef, onSwitchVariant],
  );

  // Explicit commit: POST `kind: 'ab-pick'` feedback and persist the
  // choice on both sibling messages so analytics (the
  // `copilot-ab-winner` scorer + `ab_user_choice` on `copilot_request`)
  // can track which variant the user actually selected. Idempotent —
  // re-clicking the same picked variant is a no-op; picking the other
  // variant overwrites the previous choice and re-fires feedback. The
  // button surfaces only once both variants have finished streaming, so
  // this path always sees fully-formed messages — but we still guard
  // defensively against missing siblings.
  const handlePick = React.useCallback(
    async (target: 'A' | 'B') => {
      if (target === persistedChoice) {
        return;
      }
      const targetMessage = target === 'A' ? variantA : variantB;
      const otherMessage = target === 'A' ? variantB : variantA;
      if (!targetMessage || !otherMessage) {
        return;
      }
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
        store.updateMessage(targetMessage.id, {
          metadata: { ...targetMessage.metadata, ...patch },
        });
        store.updateMessage(otherMessage.id, {
          metadata: { ...otherMessage.metadata, ...patch },
        });
      } catch (err) {
         
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
  // Show the commit bar only once both variants have FINISHED streaming
  // (i.e. both messages exist AND neither is mid-stream). Picking before
  // a variant has fully arrived would race with the executor and risk
  // sending an `ab-pick` with a half-formed responseId.
  const bothStreamed =
    !!variantA &&
    !!variantB &&
    variantA.status !== 'streaming' &&
    variantB.status !== 'streaming';

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
        {activeMessage ? (
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
        ) : (
          <BodyPlaceholder>Waiting for Variant {activeVariant} to respond…</BodyPlaceholder>
        )}
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
