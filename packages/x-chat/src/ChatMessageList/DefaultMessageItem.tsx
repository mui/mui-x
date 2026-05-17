'use client';
import * as React from 'react';
import { ChatMessageGroup } from '../ChatMessage/ChatMessageGroup';
import type {
  ChatBoxMessageSlots,
  ChatBoxMessageSlotProps,
  ChatBoxMessagesListSlots,
  ChatBoxMessagesListSlotProps,
} from '../ChatBox/ChatBox.types';

/**
 * Per-row slot interface shared by `ChatBox` and `ChatMessageList`.
 *
 * Reuses ChatBox's nested message-list / message families so the same
 * slot path works at both levels.
 */
export interface ChatMessageRowSlots {
  messagesList?: ChatBoxMessagesListSlots;
  message?: ChatBoxMessageSlots;
}

export interface ChatMessageRowSlotProps {
  messagesList?: ChatBoxMessagesListSlotProps;
  message?: ChatBoxMessageSlotProps;
}

export interface DefaultMessageItemProps {
  id: string;
  slots?: ChatMessageRowSlots;
  slotProps?: ChatMessageRowSlotProps;
}

/**
 * Default message-row composition used by `ChatBox` and `ChatMessageList`
 * when no custom `renderItem` is provided.
 *
 * `slots.messagesList.group` swaps the group component itself.
 * `slots.message` forwards (as the nested map) into the chosen group so it
 * can hand it down to the inner `ChatMessage`. Presentational `null` slots
 * collapse layout as before.
 *
 * Memoized because this is the per-row component inside the virtualized list:
 * when scroll-driven re-renders pass the same id/slots/slotProps references
 * (the parent reads them from refs), the shallow compare short-circuits.
 */
export const DefaultMessageItem = React.memo(function DefaultMessageItem({
  id,
  slots,
  slotProps,
}: DefaultMessageItemProps) {
  const GroupSlot = (slots?.messagesList?.group ?? ChatMessageGroup) as typeof ChatMessageGroup;

  return (
    <GroupSlot
      messageId={id}
      slots={{
        message: slots?.message,
      }}
      slotProps={{
        message: slotProps?.message,
      }}
      {...(slotProps?.messagesList?.group ?? {})}
    />
  );
});
