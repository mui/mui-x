'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { type ChatMessage, useChatStore, useMessageContext } from '@mui/x-chat-headless';
import { useCopilotFeedback } from './CopilotFeedbackProvider';
import { useCopilotPanelUtilityClasses, type CopilotPanelClasses } from './copilotPanelClasses';

const FooterRow = styled('div', {
  name: 'MuiCopilotMessageFooter',
  slot: 'Root',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
}));

const FooterButton = styled('button', {
  name: 'MuiCopilotMessageFooter',
  slot: 'Button',
})(({ theme }) => ({
  appearance: 'none',
  cursor: 'pointer',
  background: 'transparent',
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.25, 0.75),
  color: 'inherit',
  font: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  '& svg': {
    fontSize: '1rem',
  },
  ':hover': {
    background: theme.alpha((theme.vars || theme).palette.text.primary, 0.08),
  },
  '&[aria-pressed="true"]': {
    background: theme.alpha((theme.vars || theme).palette.text.primary, 0.08),
    borderColor: (theme.vars || theme).palette.divider,
  },
  '&[disabled]': {
    cursor: 'default',
    opacity: 0.7,
  },
}));

export interface CopilotMessageFooterProps {
  /**
   * The assistant message to render the footer for. Falls back to the
   * surrounding `MessageContext` when omitted (the default when mounted inside a
   * chat message).
   */
  message?: ChatMessage | null;
  /** Override or extend the styles applied to the component. */
  classes?: Partial<CopilotPanelClasses>;
  /** Class name applied to the root element. */
  className?: string;
}

/**
 * Footer rendered under every single-response assistant message in the Copilot
 * panel: thumbs-up / thumbs-down feedback.
 *
 * Clicking a thumb invokes the host-supplied feedback handler (wired via
 * `CopilotFeedbackProvider`) with a `kind: 'thumbs'` payload, then patches
 * `message.metadata.userFeedback` on the chat store so the picked side stays
 * highlighted across re-renders / reloads. When no feedback handler is provided
 * (e.g. an echo demo) the thumbs are hidden.
 *
 * A/B-pair messages (`abPairId` + `abVariant` set) skip their own footer UI:
 * variant selection + feedback are driven by the host-injected A/B variant tabs
 * to avoid a redundant button.
 */
function CopilotMessageFooter(props: CopilotMessageFooterProps) {
  const { message: messageProp, classes: classesProp, className } = props;
  const ctx = useMessageContext();
  const message = messageProp !== undefined ? messageProp : ctx.message;
  // The footer renders inside a chat message (i.e. within a `<ChatProvider>`),
  // so the store is always available to persist the picked side.
  const store = useChatStore();
  const submitFeedback = useCopilotFeedback();
  const classes = useCopilotPanelUtilityClasses(classesProp);
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
  // A/B-pair messages render inside a tabbed card supplied by the host; the
  // tabs drive variant selection + feedback, so the footer skips its own UI.
  if (abPairId && abVariant) {
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
    } catch (error) {
      console.warn('MUI X Copilot: thumbs feedback failed:', error);
    } finally {
      setPending(null);
    }
  };

  return (
    <FooterRow className={clsx(classes.footer, className)}>
      <FooterButton
        type="button"
        aria-pressed={userFeedback === 'positive'}
        disabled={pending === 'positive'}
        onClick={() => onThumbs('positive')}
        aria-label="Mark this answer as helpful"
        title="Helpful"
      >
        <ThumbUpOutlinedIcon />
      </FooterButton>
      <FooterButton
        type="button"
        aria-pressed={userFeedback === 'negative'}
        disabled={pending === 'negative'}
        onClick={() => onThumbs('negative')}
        aria-label="Mark this answer as not helpful"
        title="Not helpful"
      >
        <ThumbDownOutlinedIcon />
      </FooterButton>
    </FooterRow>
  );
}

export { CopilotMessageFooter };
