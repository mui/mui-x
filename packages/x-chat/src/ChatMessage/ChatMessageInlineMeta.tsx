'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { MessageMeta } from '@mui/x-chat-headless';
import type { MessageMetaProps } from '@mui/x-chat-headless';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { styled } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { chatMessageClasses } from './chatMessageClasses';

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
})<{ ownerState?: { role?: string; isOwnMessage?: boolean } }>(({ theme, ownerState }) => {
  const isOwn = ownerState?.isOwnMessage ?? false;

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
    // Dark mode (own): primary.main becomes a lighter blue → switch to dark meta for contrast.
    color: isOwn ? 'rgba(255,255,255,0.65)' : (theme.vars || theme).palette.text.disabled,
    ...(isOwn &&
      theme.applyStyles('dark', {
        color: 'rgba(0,0,0,0.55)',
      })),
    ...(!isOwn &&
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

export interface ChatMessageInlineMetaProps extends MessageMetaProps {}

/**
 * Wrapper that renders a spacer + the MessageMeta absolutely positioned at the
 * bottom-right of the parent bubble. Uses the Telegram-style "spacer + absolute
 * positioning" trick so the meta appears inline with short text and at the
 * bottom-right for long text.
 *
 * Must be rendered inside a bubble with `position: relative`.
 */
function ChatMessageInlineMeta(props: ChatMessageInlineMetaProps) {
  const { slots, slotProps, ...other } = props;

  return (
    <React.Fragment>
      <ChatMessageInlineMetaSpacer
        className={chatMessageClasses.inlineMetaSpacer}
        aria-hidden="true"
      />
      <MessageMeta
        {...other}
        slots={{
          meta: ChatMessageInlineMetaContainer,
          status: InlineStatusSlot,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          meta: mergeSlotProps(
            { className: chatMessageClasses.inlineMeta },
            slotProps?.meta,
          ) as any,
        }}
      />
    </React.Fragment>
  );
}

ChatMessageInlineMeta.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatMessageInlineMeta };
