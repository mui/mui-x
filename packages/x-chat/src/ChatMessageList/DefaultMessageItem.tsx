'use client';
import * as React from 'react';
import { type ChatMessageProps } from '../ChatMessage/ChatMessage';
import { type ChatMessageActionsProps } from '../ChatMessage/ChatMessageActions';
import { type ChatMessageAvatarProps } from '../ChatMessage/ChatMessageAvatar';
import { type ChatMessageContentProps } from '../ChatMessage/ChatMessageContent';
import { ChatMessageGroup, type ChatMessageGroupProps } from '../ChatMessage/ChatMessageGroup';
import { type ChatMessageMetaProps } from '../ChatMessage/ChatMessageMeta';

/**
 * Per-row slot interface shared by `ChatBox` and `ChatMessageList`.
 *
 * These slots replace the components used by the default row builder.
 * They mirror the row-level subset of `ChatBoxSlots`.
 */
export interface ChatMessageRowSlots {
  /** Override the message group component. */
  group: React.ElementType;
  /** Override the message root component for each message. */
  message: React.ElementType;
  /**
   * Override the message avatar component.
   * Pass `null` to hide the avatar and drop the reserved avatar grid track.
   */
  avatar: React.ElementType | null;
  /** Override the message content (bubble) component. */
  content: React.ElementType;
  /**
   * Override the message meta component (external meta shown in compact variant).
   * Pass `null` to hide it.
   */
  meta: React.ElementType | null;
  /**
   * Override the message actions component.
   * Pass `null` to hide actions entirely.
   */
  actions: React.ElementType | null;
}

export interface ChatMessageRowSlotProps {
  group?: Partial<ChatMessageGroupProps>;
  message?: Partial<ChatMessageProps>;
  avatar?: Partial<ChatMessageAvatarProps>;
  content?: Partial<ChatMessageContentProps>;
  meta?: Partial<ChatMessageMetaProps>;
  actions?: Partial<ChatMessageActionsProps>;
}

export interface DefaultMessageItemProps {
  id: string;
  slots?: Partial<ChatMessageRowSlots>;
  slotProps?: ChatMessageRowSlotProps;
}

/**
 * Default message-row composition used by `ChatBox` and `ChatMessageList`
 * when no custom `renderItem` is provided.
 *
 * Composition is slot-driven: `ChatMessageGroup` (or the `group` slot override)
 * renders `ChatMessage` (or the `message` slot override), which in turn renders
 * its inner tree (avatar, content, meta, error, actions) from the forwarded slots.
 * Passing `null` for a presentational slot (`avatar`, `meta`, `actions`) hides it
 * and collapses the surrounding layout.
 */
export function DefaultMessageItem({ id, slots, slotProps }: DefaultMessageItemProps) {
  const GroupSlot = (slots?.group ?? ChatMessageGroup) as typeof ChatMessageGroup;
  const groupProps = slotProps?.group;

  // Forward the message + inner slot map to ChatMessageGroup. It splits off
  // its own `group` slot from the rest and hands the remainder to `ChatMessage`.
  const innerSlots = {
    message: slots?.message,
    avatar: slots?.avatar,
    content: slots?.content,
    meta: slots?.meta,
    actions: slots?.actions,
  } as Partial<ChatMessageGroupProps['slots']>;
  const innerSlotProps = {
    message: slotProps?.message,
    avatar: slotProps?.avatar,
    content: slotProps?.content,
    meta: slotProps?.meta,
    actions: slotProps?.actions,
  } as ChatMessageGroupProps['slotProps'];

  return (
    <GroupSlot
      messageId={id}
      slots={innerSlots}
      slotProps={innerSlotProps}
      {...(groupProps ?? {})}
    />
  );
}
