'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useMessage, useMessageIds } from '../hooks/useMessage';
import type { ChatMessage } from '../types/chat-entities';
import { useChatVariant } from '../chat/internals/ChatVariantContext';
import { useChatDensity } from '../chat/internals/ChatDensityContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { MessageAvatar } from '../message/MessageAvatar';
import { MessageContent } from '../message/MessageContent';
import { MessageMeta } from '../message/MessageMeta';
import { MessageRoot } from '../message/MessageRoot';
import { type MessageGroupOwnerState } from './messageGroup.types';

/**
 * A function that maps a message to a group key.
 * Messages that resolve to the same key are visually grouped together
 * (shared avatar, author name, etc.).
 * @param {ChatMessage} message The message to derive a group key from.
 * @returns {string | number} The group key for the message.
 */
export type GroupKeyFn = (message: ChatMessage) => string | number;

const DEFAULT_GROUP_KEY: GroupKeyFn = (message) => message.author?.id ?? message.role ?? '';

/**
 * Creates a `groupKey` function that groups messages by author within a sliding
 * time window. Messages from the same author sent more than `windowMs` milliseconds
 * apart will start a new group.
 *
 * @param windowMs - The grouping window in milliseconds. Defaults to 300 000 (5 minutes).
 *
 * @example
 * // Group messages from the same author within a 1-minute window
 * <MessageGroup groupKey={createTimeWindowGroupKey(60_000)} messageId={id} />
 */
export function createTimeWindowGroupKey(windowMs: number = 300_000): GroupKeyFn {
  return (message: ChatMessage) => {
    const timestamp = message.createdAt ? Date.parse(message.createdAt) : null;
    const bucket =
      timestamp != null && !Number.isNaN(timestamp) ? Math.floor(timestamp / windowMs) : 0;
    return `${message.author?.id ?? message.role ?? ''}-${bucket}`;
  };
}

function resolveMessageIndex(messageId: string, index: number | undefined, items: string[]) {
  if (index != null) {
    return index;
  }

  return items.indexOf(messageId);
}

function getAuthorLabel(message: ChatMessage | null) {
  if (!message) {
    return null;
  }

  return message.author?.displayName ?? message.author?.id ?? message.role;
}

export interface MessageGroupSlots {
  group: React.ElementType;
  authorName: React.ElementType;
  /**
   * The timestamp element rendered next to the author name in compact mode.
   * Only rendered when `variant === 'compact'` and the message has a `createdAt` value.
   * @default 'span'
   */
  groupTimestamp: React.ElementType;
}

export interface MessageGroupSlotProps {
  group?: SlotComponentPropsFromProps<'div', {}, MessageGroupOwnerState>;
  authorName?: SlotComponentPropsFromProps<'div', {}, MessageGroupOwnerState>;
  groupTimestamp?: SlotComponentPropsFromProps<'span', {}, MessageGroupOwnerState>;
}

export interface MessageGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  messageId: string;
  index?: number;
  items?: string[];
  /**
   * A function that maps a message to a group key.
   * Messages that resolve to the same key are visually grouped (shared avatar, author name, etc.).
   * Use `createTimeWindowGroupKey(windowMs)` to replicate time-window-based grouping.
   * @default (message) => message.author?.id ?? message.role ?? ''
   */
  groupKey?: GroupKeyFn;
  slots?: Partial<MessageGroupSlots>;
  slotProps?: MessageGroupSlotProps;
}

type MessageGroupComponent = ((
  props: MessageGroupProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const MessageGroup = React.forwardRef(function MessageGroup(
  props: MessageGroupProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    messageId,
    index,
    items: itemsProp,
    groupKey = DEFAULT_GROUP_KEY,
    slots,
    slotProps,
    ...other
  } = props;
  const defaultItems = useMessageIds();
  const items = itemsProp ?? defaultItems;
  const messageIndex = resolveMessageIndex(messageId, index, items);
  const previousMessageId = messageIndex > 0 ? items[messageIndex - 1] : undefined;
  const nextMessageId =
    messageIndex >= 0 && messageIndex < items.length - 1 ? items[messageIndex + 1] : undefined;
  const message = useMessage(messageId);
  const previousMessage = useMessage(previousMessageId ?? '');
  const nextMessage = useMessage(nextMessageId ?? '');
  const variant = useChatVariant();
  const density = useChatDensity();
  const prevKey = previousMessage ? groupKey(previousMessage) : null;
  const currentKey = message ? groupKey(message) : null;
  const nextKey = nextMessage ? groupKey(nextMessage) : null;

  const isFirst = prevKey === null || prevKey !== currentKey;
  const isFirstInList = messageIndex === 0;
  const isLast = nextKey === null || nextKey !== currentKey;

  const ownerState = React.useMemo<MessageGroupOwnerState>(
    () => ({
      isFirst,
      isFirstInList,
      isLast,
      authorRole: message?.role,
      authorId: message?.author?.id,
      variant,
      density,
    }),
    [density, isFirst, isFirstInList, isLast, message?.author?.id, message?.role, variant],
  );
  const Group = slots?.group ?? 'div';
  const AuthorName = slots?.authorName ?? 'div';
  const groupProps = useSlotProps({
    elementType: Group,
    externalSlotProps: slotProps?.group,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      ...getDataAttributes({
        isFirst: ownerState.isFirst,
        isLast: ownerState.isLast,
        authorRole: ownerState.authorRole,
      }),
    },
  });
  const authorNameProps = useSlotProps({
    elementType: AuthorName,
    externalSlotProps: slotProps?.authorName,
    ownerState,
  });
  const authorLabel = getAuthorLabel(message);
  const showGroupAuthorName = isFirst && Boolean(authorLabel);

  const authorNameElement = showGroupAuthorName ? (
    <AuthorName {...authorNameProps}>{authorLabel}</AuthorName>
  ) : null;

  // In compact mode the author name lives inside the message grid so it shares
  // a row with the avatar. In default mode it sits above the grid.
  const compactAuthorName = variant === 'compact' ? authorNameElement : null;
  const defaultAuthorName = variant !== 'compact' ? authorNameElement : null;

  return (
    <Group {...groupProps}>
      {defaultAuthorName}
      {children ? (
        // When custom children are provided (e.g. from DefaultMessageItem),
        // pass `isGrouped` via cloneElement so the inner MessageRoot/ChatMessage
        // receives the correct grouping state for its context.
        // In compact mode, also inject the author name element into the
        // children so it appears inside the CSS grid (sharing a row with the avatar).
        // We wrap in a Fragment to avoid duplicate-key warnings.
        React.Children.map(children, (child) => {
          if (!React.isValidElement(child) || typeof child.type === 'string') {
            return child;
          }
          const clone = child as React.ReactElement<Record<string, unknown>>;
          if (compactAuthorName) {
            const existingChildren = (clone.props as { children?: React.ReactNode }).children;
            return React.cloneElement(clone, {
              isGrouped: !isFirst,
              children: (
                <React.Fragment>
                  {compactAuthorName}
                  {existingChildren}
                </React.Fragment>
              ),
            });
          }
          return React.cloneElement(clone, { isGrouped: !isFirst });
        })
      ) : (
        <MessageRoot isGrouped={!isFirst} messageId={messageId}>
          <MessageAvatar />
          {compactAuthorName}
          <MessageContent />
          <MessageMeta />
        </MessageRoot>
      )}
    </Group>
  );
}) as MessageGroupComponent;
