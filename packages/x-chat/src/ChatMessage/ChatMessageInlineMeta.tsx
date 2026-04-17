'use client';
import * as React from 'react';
import { MessageMeta } from '@mui/x-chat-headless';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { styled } from '../internals/zero-styled';

/**
 * Invisible inline element that reserves space for the absolutely-positioned meta.
 * It flows with the text content: if the last line is short enough, the meta sits
 * on the same line as the text. If text is long, the spacer wraps to a new line,
 * creating room at the bottom-right of the bubble.
 */
const ChatMessageInlineMetaSpacer = styled('span', {
  name: 'MuiChatMessage',
  slot: 'InlineMetaSpacer',
})({
  display: 'inline-block',
  width: 72,
  height: '1.2em',
  verticalAlign: 'bottom',
  pointerEvents: 'none',
  // Prevent the timestamp from crowding short messages (e.g. "OK", "Thanks")
  marginInlineStart: 8,
});

/**
 * Absolutely positioned container for timestamp + status + edited label,
 * anchored to the bottom-right (or bottom-left in RTL) of the bubble.
 */
const ChatMessageInlineMetaContainer = styled('span', {
  name: 'MuiChatMessage',
  slot: 'InlineMeta',
})<{ ownerState?: { role?: string } }>(({ theme, ownerState }) => {
  const isUser = ownerState?.role === 'user';

  return {
    position: 'absolute',
    bottom: theme.spacing(0.75),
    insetInlineEnd: theme.spacing(1.5),
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.25),
    fontSize: theme.typography.caption.fontSize,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    userSelect: 'none',
    // Light mode: primary.main is dark blue → white meta is readable.
    // Dark mode (user): primary.main becomes a lighter blue → switch to dark meta for contrast.
    color: isUser ? 'rgba(255,255,255,0.65)' : (theme.vars || theme).palette.text.disabled,
    ...(isUser &&
      theme.applyStyles('dark', {
        color: 'rgba(0,0,0,0.55)',
      })),
    ...(!isUser &&
      theme.applyStyles('dark', {
        color: 'rgba(255,255,255,0.45)',
      })),
  };
});

const InlineStatusStyled = styled('span', {
  name: 'MuiChatMessage',
  slot: 'InlineMetaStatus',
})({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '1em',
});

/**
 * Custom Status slot for inline meta.
 * Renders a Done icon for "sent" status and DoneAll icon for "read" status.
 */
const InlineStatusSlot = React.forwardRef<HTMLSpanElement, any>(function InlineStatusSlot(
  { ownerState, children, ...other },
  ref,
) {
  const status = ownerState?.message?.status;
  const isSent = status === 'sent';
  const isRead = status === 'read';

  return (
    <InlineStatusStyled ref={ref} {...other}>
      {isSent && <DoneIcon sx={{ fontSize: '1em' }} aria-hidden="true" />}
      {isRead && <DoneAllIcon sx={{ fontSize: '1em' }} aria-hidden="true" />}
      {!isSent && !isRead && children}
    </InlineStatusStyled>
  );
});

/**
 * Wrapper that renders a spacer + the MessageMeta absolutely positioned at the
 * bottom-right of the parent bubble. Uses the Telegram-style "spacer + absolute
 * positioning" trick so the meta appears inline with short text and at the
 * bottom-right for long text.
 *
 * Must be rendered inside a bubble with `position: relative`.
 */

function ChatMessageInlineMeta() {
  return (
    <React.Fragment>
      <ChatMessageInlineMetaSpacer aria-hidden="true" />
      <MessageMeta
        slots={{
          meta: ChatMessageInlineMetaContainer,
          status: InlineStatusSlot,
        }}
      />
    </React.Fragment>
  );
}

export { ChatMessageInlineMeta };
