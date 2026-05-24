'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useMessageContext, useMessageIds, useChatStore } from '@mui/x-chat-headless';

/**
 * Footer rendered under every assistant message in the Copilot panel.
 *
 * Two modes, decided per-message from `message.metadata`:
 *
 *  - **A/B pair** (`abPairId` + `abVariant` set, `userAbChoice` unset) →
 *    a "Use this answer" button + a faint divider that links visually to
 *    the sibling message. Clicking POSTs `kind: 'ab-pick'` to the
 *    backend's `/feedback` endpoint and patches both sibling messages'
 *    `metadata.userAbChoice` so the buttons collapse to a "✓ Chosen"
 *    badge across page reloads (the metadata round-trips through
 *    `createGridCopilotLocalStorageAdapter`).
 *
 *  - **Single response** (no `abPairId`) → thumbs-up / thumbs-down icons.
 *    Clicking POSTs `kind: 'thumbs'` and persists
 *    `metadata.userFeedback` so the picked side stays highlighted on
 *    reload.
 *
 * The HTTP call is delegated to a consumer-supplied `submitFeedback`
 * callback wired via the `feedbackEndpoint` / `feedbackHeaders` context.
 * The default no-op keeps this component safe to render when no backend
 * is plugged in (e.g. the echo demo).
 */

const FooterRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotMessageFooter',
})({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  marginTop: vars.spacing(0.5),
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

const FooterButton = styled('button', {
  name: 'MuiDataGrid',
  slot: 'CopilotMessageFooterButton',
})({
  appearance: 'none',
  cursor: 'pointer',
  background: 'transparent',
  border: `1px solid ${vars.colors.border.base}`,
  borderRadius: vars.radius.base,
  padding: vars.spacing(0.25, 0.75),
  color: 'inherit',
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  ':hover': {
    background: vars.colors.background.overlay,
  },
  '&[aria-pressed="true"]': {
    background: vars.colors.background.overlay,
    borderColor: vars.colors.border.base,
  },
  '&[disabled]': {
    cursor: 'default',
    opacity: 0.7,
  },
});

const FooterBadge = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotMessageFooterBadge',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  padding: vars.spacing(0.25, 0.5),
  borderRadius: vars.radius.base,
  border: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.overlay,
  font: vars.typography.font.small,
  color: vars.colors.foreground.base,
});

/** Discriminated payload posted to the consumer-supplied feedback handler. */
export type CopilotFeedbackPayload =
  | {
      kind: 'thumbs';
      responseId: string;
      feedback: 'positive' | 'negative';
      comment?: string;
    }
  | {
      kind: 'ab-pick';
      abPairId: string;
      chosenResponseId: string;
      otherResponseId: string;
      chosenVariant: 'A' | 'B';
      comment?: string;
    };

export type CopilotFeedbackSubmit = (payload: CopilotFeedbackPayload) => Promise<void> | void;

/**
 * Context that lets the consumer plug in the `/feedback` HTTP call without
 * the component having to know the backend URL or auth headers. The demo
 * sets this via `<CopilotFeedbackProvider submit={...} />`.
 */
const CopilotFeedbackContext = React.createContext<CopilotFeedbackSubmit | null>(null);

export function CopilotFeedbackProvider({
  submit,
  children,
}: {
  submit: CopilotFeedbackSubmit;
  children: React.ReactNode;
}) {
  return (
    <CopilotFeedbackContext.Provider value={submit}>{children}</CopilotFeedbackContext.Provider>
  );
}

function useCopilotFeedback(): CopilotFeedbackSubmit | null {
  return React.useContext(CopilotFeedbackContext);
}

/**
 * Locate the sibling assistant message that shares an `abPairId` with
 * `currentMessageId`. Returns `null` if no sibling exists (the twin fetch
 * hasn't landed yet, the sibling was scrolled off, etc.).
 */
function useAbSibling(currentMessageId: string, abPairId: string | undefined) {
  const messageIds = useMessageIds();
  const store = useChatStore();
  return React.useMemo(() => {
    if (!abPairId) {
      return null;
    }
    for (const id of messageIds) {
      if (id === currentMessageId) {
        continue;
      }
      const message = store.state.messagesById[id];
      if (
        message &&
        message.role === 'assistant' &&
        message.metadata?.abPairId === abPairId &&
        message.id !== currentMessageId
      ) {
        return message;
      }
    }
    return null;
  }, [messageIds, abPairId, currentMessageId, store.state.messagesById]);
}

function CopilotMessageFooter() {
  const ctx = useMessageContext();
  const message = ctx.message;
  const store = useChatStore();
  const submitFeedback = useCopilotFeedback();
  const [pending, setPending] = React.useState<string | null>(null);

  const messageMetadata = message?.metadata;
  const abPairId = messageMetadata?.abPairId;
  const abVariant = messageMetadata?.abVariant;
  const responseId = messageMetadata?.responseId;
  const userFeedback = messageMetadata?.userFeedback;
  const userAbChoice = messageMetadata?.userAbChoice;
  const sibling = useAbSibling(message?.id ?? '', abPairId);

  if (!message || message.role !== 'assistant' || message.status === 'streaming') {
    return null;
  }
  // Without a responseId we can't correlate feedback to a backend row.
  // Hide the footer rather than render a button that no-ops.
  if (!responseId) {
    return null;
  }

  const onThumbs = async (feedback: 'positive' | 'negative') => {
    if (!submitFeedback) {
      return;
    }
    setPending(feedback);
    try {
      await submitFeedback({
        kind: 'thumbs',
        responseId,
        feedback,
      });
      store.updateMessage(message.id, {
        metadata: {
          ...messageMetadata,
          userFeedback: feedback,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[Copilot] thumbs feedback failed:', err);
    } finally {
      setPending(null);
    }
  };

  const onPick = async (variant: 'A' | 'B') => {
    if (!submitFeedback || !abPairId || !sibling || !abVariant) {
      return;
    }
    const siblingResponseId = sibling.metadata?.responseId;
    if (!siblingResponseId) {
      return;
    }
    const chosenResponseId = variant === abVariant ? responseId : siblingResponseId;
    const otherResponseId = variant === abVariant ? siblingResponseId : responseId;
    setPending(`pick:${variant}`);
    try {
      await submitFeedback({
        kind: 'ab-pick',
        abPairId,
        chosenResponseId,
        otherResponseId,
        chosenVariant: variant,
      });
      // Patch both messages so the picked state survives reload and the
      // sibling footer collapses to its "not chosen" badge.
      const patch = { userAbChoice: variant } as const;
      store.updateMessage(message.id, {
        metadata: { ...messageMetadata, ...patch },
      });
      store.updateMessage(sibling.id, {
        metadata: { ...sibling.metadata, ...patch },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[Copilot] ab-pick failed:', err);
    } finally {
      setPending(null);
    }
  };

  // ── A/B pick UI ─────────────────────────────────────────────────────────
  if (abPairId && abVariant) {
    if (userAbChoice) {
      const isWinner = userAbChoice === abVariant;
      return (
        <FooterRow>
          <FooterBadge>{isWinner ? '✓ You picked this' : 'Not picked'}</FooterBadge>
        </FooterRow>
      );
    }
    // Pre-pick: render the "use this answer" button. The sibling message
    // renders its own button independently — clicking either one settles
    // the pair via `updateMessage` patches on both messages.
    return (
      <FooterRow>
        <FooterButton
          type="button"
          onClick={() => onPick(abVariant)}
          disabled={pending === `pick:${abVariant}` || !sibling}
        >
          Use this answer ({abVariant})
        </FooterButton>
        {!sibling && <span>waiting for sibling…</span>}
      </FooterRow>
    );
  }

  // ── Thumbs UI ───────────────────────────────────────────────────────────
  return (
    <FooterRow>
      <FooterButton
        type="button"
        aria-pressed={userFeedback === 'positive'}
        disabled={pending === 'positive'}
        onClick={() => onThumbs('positive')}
        aria-label="Mark this answer as helpful"
        title="Helpful"
      >
        👍
      </FooterButton>
      <FooterButton
        type="button"
        aria-pressed={userFeedback === 'negative'}
        disabled={pending === 'negative'}
        onClick={() => onThumbs('negative')}
        aria-label="Mark this answer as not helpful"
        title="Not helpful"
      >
        👎
      </FooterButton>
    </FooterRow>
  );
}

export { CopilotMessageFooter };
