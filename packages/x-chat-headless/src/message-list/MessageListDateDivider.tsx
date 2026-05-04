'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useMessage, useMessageIds } from '../hooks/useMessage';
import { useIsHydrated } from '../chat/internals/useIsHydrated';
import { type MessageListDateDividerOwnerState } from './messageList.types';

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
  const { messageId, index, items: itemsProp, formatDate, slots, slotProps, ...other } = props;
  const defaultItems = useMessageIds();
  const items = itemsProp ?? defaultItems;
  const messageIndex = resolveMessageIndex(messageId, index, items);
  const previousMessageId = messageIndex > 0 ? items[messageIndex - 1] : undefined;
  const message = useMessage(messageId);
  const previousMessage = useMessage(previousMessageId ?? '');
  const currentDate = parseDate(message?.createdAt);
  const previousDate = parseDate(previousMessage?.createdAt);
  const hasBoundary =
    messageIndex > 0 &&
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
