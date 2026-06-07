'use client';
import * as React from 'react';
import { ChatMessageGroup } from '../ChatMessage/ChatMessageGroup';
import { ChatDateDivider } from '../ChatMessage/ChatDateDivider';
import { ChatUnreadMarker } from '../ChatIndicators/ChatUnreadMarker';
import { useChatSlots } from '../internals/ChatSlotsContext';
import { resolveSlotProps } from '../internals/mergeSlotProps';
import type { ChatBoxSlots, ChatBoxSlotProps } from '../ChatBox/ChatBox.types';

/**
 * Flat per-row slot keys shared by `ChatBox` and `ChatMessageList` — the
 * message-rendering pipeline vocabulary (group wrapper, dividers, and the
 * per-row `message*` parts). A subset of the public `ChatBoxSlots`.
 */
type ChatMessageRowSlotKeys =
  | 'messageGroup'
  | 'dateDivider'
  | 'unreadMarker'
  | 'messageRoot'
  | 'messageAvatar'
  | 'messageContent'
  | 'messageMeta'
  | 'messageInlineMeta'
  | 'messageError'
  | 'messageActions'
  | 'messageAuthorName';

export interface ChatMessageRowSlots extends Pick<ChatBoxSlots, ChatMessageRowSlotKeys> {}

export interface ChatMessageRowSlotProps extends Pick<ChatBoxSlotProps, ChatMessageRowSlotKeys> {}

export interface DefaultMessageItemProps {
  id: string;
  /**
   * Index of this row within the rendered list. Forwarded to the group so grouping
   * (previous/next neighbor lookup) is computed against the rendered list rather than
   * the full conversation when a custom `items` subset is used.
   */
  index?: number;
  /** The rendered list's message ids. Forwarded to the group alongside `index`. */
  items?: string[];
  slots?: ChatMessageRowSlots;
  slotProps?: ChatMessageRowSlotProps;
}

/**
 * Default message-row composition used by `ChatBox` and `ChatMessageList`
 * when no custom `renderItem` is provided.
 *
 * Slots are read from the `ChatSlots` context (the `ChatBox` path) unless passed
 * explicitly via props (the standalone `ChatMessageList` path, which partitions
 * its own flat slots and forwards the row keys here). `messageGroup` swaps the
 * group component; the flat `message*` keys flow into the group, which maps them
 * onto the inner `ChatMessage`'s short local slots.
 *
 * Memoized because this is the per-row component inside the virtualized list:
 * `ChatBox`'s `renderItem` carries no slot payload (it reads context), so
 * scroll-driven re-renders short-circuit on the shallow id/index/items compare.
 */
export const DefaultMessageItem = React.memo(function DefaultMessageItem({
  id,
  index,
  items,
  slots: slotsProp,
  slotProps: slotPropsProp,
}: DefaultMessageItemProps) {
  const context = useChatSlots();
  const slots = slotsProp ?? context.slots;
  const slotProps = slotPropsProp ?? context.slotProps;

  // Row-level dividers. Both the date divider and the unread marker are
  // self-suppressing: they read `messageId`/`index`/`items` and render only at
  // their boundary (a new calendar day, or the first unread message derived from
  // the active conversation's `unreadCount`/`readState`), returning null otherwise.
  // `null` hides the slot entirely; `undefined` falls back to the default component.
  // A custom slot must therefore be a component (it receives `messageId`/`index`/
  // `items`); a raw host element would both fail to self-suppress and leak those as
  // DOM attributes.
  const DateDividerComponent = (slots.dateDivider ?? ChatDateDivider) as React.ElementType;
  const UnreadMarkerComponent = (slots.unreadMarker ?? ChatUnreadMarker) as React.ElementType;

  return (
    <React.Fragment>
      {slots.dateDivider !== null && (
        <DateDividerComponent
          {...resolveSlotProps(slotProps.dateDivider ?? {}, { messageId: id, index, items })}
          messageId={id}
          index={index}
          items={items}
        />
      )}
      {slots.unreadMarker !== null && (
        <UnreadMarkerComponent
          {...resolveSlotProps(slotProps.unreadMarker ?? {}, { messageId: id, index, items })}
          messageId={id}
          index={index}
          items={items}
        />
      )}
      {/*
        Always render `ChatMessageGroup`. It consumes `slots.messageGroup` as the
        group's wrapper element (and `slotProps.messageGroup` as that wrapper's
        props), so the default avatar/content/meta tree still renders inside it.
        Hoisting `messageGroup` to the row component here would let a plain wrapper
        element (e.g. `'section'`) replace the entire row and render empty, with the
        internal `messageId`/`index`/`items` props leaking onto the DOM node.
      */}
      <ChatMessageGroup
        messageId={id}
        index={index}
        items={items}
        slots={slots}
        slotProps={slotProps}
      />
    </React.Fragment>
  );
});
