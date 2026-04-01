'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessage, useMessageIds, type ChatMessage } from '@mui/x-chat-headless';
import { useChatVariant } from '../chat/internals/ChatVariantContext';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useIsHydrated } from '../chat/internals/useIsHydrated';
import { getDataAttributes } from '../internals/getDataAttributes';
import { MessageAvatar } from '../message/MessageAvatar';
import { MessageContent } from '../message/MessageContent';
import { MessageMeta } from '../message/MessageMeta';
import { MessageRoot } from '../message/MessageRoot';
import { type MessageGroupOwnerState } from './messageGroup.types';

const DEFAULT_GROUPING_WINDOW_MS = 300_000;

function resolveMessageIndex(messageId: string, index: number | undefined, items: string[]) {
  if (index != null) {
    return index;
  }

  return items.indexOf(messageId);
}

function parseTimestamp(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);

  return Number.isNaN(parsed) ? null : parsed;
}

function getAuthorIdentity(message: ChatMessage | null) {
  if (!message) {
    return null;
  }

  return {
    id: message.author?.id,
    role: message.role,
  };
}

function areMessagesGrouped(
  left: ChatMessage | null,
  right: ChatMessage | null,
  groupingWindowMs: number,
) {
  if (!left || !right) {
    return false;
  }

  const leftAuthor = getAuthorIdentity(left);
  const rightAuthor = getAuthorIdentity(right);

  if (!leftAuthor || !rightAuthor) {
    return false;
  }

  const sameAuthor =
    leftAuthor.id && rightAuthor.id
      ? leftAuthor.id === rightAuthor.id
      : leftAuthor.role === rightAuthor.role;

  if (!sameAuthor) {
    return false;
  }

  const leftTimestamp = parseTimestamp(left.createdAt);
  const rightTimestamp = parseTimestamp(right.createdAt);

  if (leftTimestamp == null || rightTimestamp == null) {
    return true;
  }

  return Math.abs(rightTimestamp - leftTimestamp) <= groupingWindowMs;
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
  group?: SlotComponentProps<'div', {}, MessageGroupOwnerState>;
  authorName?: SlotComponentProps<'div', {}, MessageGroupOwnerState>;
  groupTimestamp?: SlotComponentProps<'span', {}, MessageGroupOwnerState>;
}

export interface MessageGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  messageId: string;
  index?: number;
  items?: string[];
  groupingWindowMs?: number;
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
    groupingWindowMs = DEFAULT_GROUPING_WINDOW_MS,
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
  const localeText = useChatLocaleText();
  const isHydrated = useIsHydrated();
  const isFirst = !areMessagesGrouped(previousMessage, message, groupingWindowMs);
  const isLast = !areMessagesGrouped(message, nextMessage, groupingWindowMs);
  const ownerState = React.useMemo<MessageGroupOwnerState>(
    () => ({
      isFirst,
      isLast,
      authorRole: message?.role,
      authorId: message?.author?.id,
      variant,
    }),
    [isFirst, isLast, message?.author?.id, message?.role, variant],
  );
  const Group = slots?.group ?? 'div';
  const AuthorName = slots?.authorName ?? 'div';
  const GroupTimestamp = slots?.groupTimestamp ?? 'span';
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
  const groupTimestampProps = useSlotProps({
    elementType: GroupTimestamp,
    externalSlotProps: slotProps?.groupTimestamp,
    ownerState,
  });
  const authorLabel = getAuthorLabel(message);
  const showGroupAuthorName = isFirst && Boolean(authorLabel);

  // In compact mode, the group header also shows the first message's timestamp
  // so it does not need to be repeated in the per-message meta row.
  const compactTimestampLabel =
    variant === 'compact' && isHydrated && message?.createdAt
      ? localeText.messageTimestampLabel(message.createdAt)
      : null;

  const authorNameElement = showGroupAuthorName ? (
    <AuthorName {...authorNameProps}>
      {authorLabel}
      {compactTimestampLabel ? (
        <GroupTimestamp {...groupTimestampProps}>{compactTimestampLabel}</GroupTimestamp>
      ) : null}
    </AuthorName>
  ) : null;

  return (
    <Group {...groupProps}>
      {/* Default: author name sits above the message grid */}
      {variant !== 'compact' ? authorNameElement : null}
      <MessageRoot isGrouped={!isFirst} messageId={messageId}>
        {children ?? (
          <React.Fragment>
            <MessageAvatar />
            {/* Compact: author name is inside the grid so it shares a row with the avatar */}
            {variant === 'compact' ? authorNameElement : null}
            <MessageContent />
            <MessageMeta />
          </React.Fragment>
        )}
      </MessageRoot>
    </Group>
  );
}) as MessageGroupComponent;
