'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import {
  useMessage,
  useMessageIds,
} from '@mui/x-chat-headless';
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

function isSameCalendarDay(left: Date, right: Date) {
  return formatIsoDay(left) === formatIsoDay(right);
}

export interface MessageListDateDividerSlots {
  root: React.ElementType;
  label: React.ElementType;
}

export interface MessageListDateDividerSlotProps {
  root?: SlotComponentProps<'div', {}, MessageListDateDividerOwnerState>;
  label?: SlotComponentProps<'div', {}, MessageListDateDividerOwnerState>;
}

export interface MessageListDateDividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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
  const {
    messageId,
    index,
    items: itemsProp,
    formatDate,
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
    messageIndex > 0 &&
    currentDate != null &&
    previousDate != null &&
    !isSameCalendarDay(previousDate, currentDate);
  const label = currentDate ? formatDate?.(currentDate) ?? formatIsoDay(currentDate) : null;
  const ownerState = React.useMemo<MessageListDateDividerOwnerState>(
    () => ({
      messageId,
      hasBoundary,
      label,
    }),
    [hasBoundary, label, messageId],
  );
  const Root = slots?.root ?? 'div';
  const Label = slots?.label ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      role: 'separator',
    },
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
    <Root {...rootProps}>
      <Label {...labelProps}>{label}</Label>
    </Root>
  );
}) as MessageListDateDividerComponent;
