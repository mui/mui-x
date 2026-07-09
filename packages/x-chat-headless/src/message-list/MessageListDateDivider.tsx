'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useIsHydrated } from '@mui/x-internals/useIsHydrated';
import { useMessage, useMessageIds } from '../hooks/useMessage';
import { type MessageListDateDividerOwnerState } from './messageList.types';
import type { ChatMessage } from '../types/chat-entities';

function resolveMessageIndex(messageId: string, index: number | undefined, items: string[]) {
  if (index != null) {
    return index;
  }

  return items.indexOf(messageId);
}

function parseDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatIsoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatLocalDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isSameCalendarDay(left: Date, right: Date) {
  return formatIsoDay(left) === formatIsoDay(right);
}

export interface MessageListDateDividerSlots {
  divider: React.ElementType;
  line: React.ElementType;
  label: React.ElementType;
}

export interface MessageListDateDividerSlotProps {
  divider?: SlotComponentPropsFromProps<'div', {}, MessageListDateDividerOwnerState>;
  line?: SlotComponentPropsFromProps<'div', {}, MessageListDateDividerOwnerState>;
  label?: SlotComponentPropsFromProps<'div', {}, MessageListDateDividerOwnerState>;
}

export interface MessageListDateDividerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  messageId: string;
  index?: number;
  items?: string[];
  formatDate?: (date: Date) => React.ReactNode;
  /**
   * Decides whether the divider renders above the message, replacing the
   * built-in rule when provided. `date`/`previousDate` are the parsed
   * `createdAt` values (`null` when missing or invalid); `previousMessage`
   * is `null` for the first message in the list.
   * @param {object} params The parameters used to decide whether to render the divider.
   * @param {ChatMessage} params.message The message the divider would render above.
   * @param {ChatMessage | null} params.previousMessage The previous message, or `null` for the first message in the list.
   * @param {number} params.index The index of the message in the list.
   * @param {Date | null} params.date The parsed `createdAt` of the message, or `null` when missing or invalid.
   * @param {Date | null} params.previousDate The parsed `createdAt` of the previous message, or `null` when missing or invalid.
   * @returns {boolean} `true` to render the divider above the message.
   * @default Renders when `message.createdAt` falls on a different UTC
   * calendar day than the previous message's.
   */
  shouldShowDivider?: (params: {
    message: ChatMessage;
    previousMessage: ChatMessage | null;
    index: number;
    date: Date | null;
    previousDate: Date | null;
  }) => boolean;
  slots?: Partial<MessageListDateDividerSlots>;
  slotProps?: MessageListDateDividerSlotProps;
}

type MessageListDateDividerComponent = ((
  props: MessageListDateDividerProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const MessageListDateDivider = React.forwardRef(function MessageListDateDivider(
  props: MessageListDateDividerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    messageId,
    index,
    items: itemsProp,
    formatDate,
    shouldShowDivider,
    slots,
    slotProps,
    ...other
  } = props;
  const defaultItems = useMessageIds();
  const items = itemsProp ?? defaultItems;
  const messageIndex = resolveMessageIndex(messageId, index, items);
  const previousMessageId = messageIndex > 0 ? items[messageIndex - 1] : undefined;
  const message = useMessage(messageId);
  const previousMessage = useMessage(previousMessageId ?? '');
  const currentDate = parseDate(message?.createdAt);
  const previousDate = parseDate(previousMessage?.createdAt);
  const hasBoundary =
    shouldShowDivider != null && message != null
      ? shouldShowDivider({
          message,
          previousMessage,
          index: messageIndex,
          date: currentDate,
          previousDate,
        })
      : messageIndex > 0 &&
        currentDate != null &&
        previousDate != null &&
        !isSameCalendarDay(previousDate, currentDate);
  const isHydrated = useIsHydrated();
  const label =
    isHydrated && currentDate ? (formatDate?.(currentDate) ?? formatLocalDate(currentDate)) : null;
  const ownerState = React.useMemo<MessageListDateDividerOwnerState>(
    () => ({
      messageId,
      hasBoundary,
      label,
    }),
    [hasBoundary, label, messageId],
  );
  const Divider = slots?.divider ?? 'div';
  const Line = slots?.line ?? 'div';
  const Label = slots?.label ?? 'div';
  const dividerProps = useSlotProps({
    elementType: Divider,
    externalSlotProps: slotProps?.divider,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      role: 'separator',
    },
  });
  const lineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.line,
    ownerState,
  });
  const labelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.label,
    ownerState,
  });

  if (!hasBoundary) {
    return null;
  }

  return (
    <Divider {...dividerProps}>
      <Line {...lineProps} />
      <Label {...labelProps}>{label}</Label>
      <Line {...lineProps} />
    </Divider>
  );
}) as MessageListDateDividerComponent;
