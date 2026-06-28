'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useMessageContext, useChatStore } from '@mui/x-chat-headless';

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

export function useCopilotFeedback(): CopilotFeedbackSubmit | null {
  return React.useContext(CopilotFeedbackContext);
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
       
      console.warn('[Copilot] thumbs feedback failed:', err);
    } finally {
      setPending(null);
    }
  };

  // AB-pair messages are rendered inside a tabbed card by
  // `CopilotAbVariantTabs`; the tabs themselves drive variant selection
  // and feedback, so the footer skips its own pick UI to avoid a redundant
  // button + a "waiting for sibling…" stub while a sibling streams.
  if (abPairId && abVariant) {
    return null;
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
