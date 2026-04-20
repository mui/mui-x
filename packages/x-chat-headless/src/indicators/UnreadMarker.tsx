'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useChat } from '../hooks/useChat';
import { useMessageIds } from '../hooks/useMessage';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { type UnreadMarkerOwnerState } from './indicators.types';

function resolveMessageIndex(messageId: string, index: number | undefined, items: string[]) {
  if (index != null) {
    return index;
  }

  return items.indexOf(messageId);
}

export interface UnreadMarkerSlots {
  root: React.ElementType;
  label: React.ElementType;
}

export interface UnreadMarkerSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, UnreadMarkerOwnerState>;
  label?: SlotComponentPropsFromProps<'div', {}, UnreadMarkerOwnerState>;
}

export interface UnreadMarkerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  messageId: string;
  index?: number;
  items?: string[];
  label?: React.ReactNode;
  slots?: Partial<UnreadMarkerSlots>;
  slotProps?: UnreadMarkerSlotProps;
}

type UnreadMarkerComponent = ((
  props: UnreadMarkerProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const UnreadMarker = React.forwardRef(function UnreadMarker(
  props: UnreadMarkerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    messageId,
    index,
    items: itemsProp,
    label: labelProp,
    slots,
    slotProps,
    ...other
  } = props;
  const localeText = useChatLocaleText();
  const label = labelProp ?? localeText.unreadMarkerLabel;
  const defaultItems = useMessageIds();
  const { activeConversationId, conversations } = useChat();
  const items = itemsProp ?? defaultItems;
  const messageIndex = resolveMessageIndex(messageId, index, items);
  const activeConversation = React.useMemo(
    () =>
      activeConversationId == null
        ? null
        : (conversations.find((candidate) => candidate.id === activeConversationId) ?? null),
    [activeConversationId, conversations],
  );
  const boundaryIndex = React.useMemo(() => {
    if (!activeConversation || items.length === 0) {
      return -1;
    }

    if (activeConversation.unreadCount != null && activeConversation.unreadCount > 0) {
      return Math.max(0, items.length - activeConversation.unreadCount);
    }

    if (activeConversation.readState === 'unread') {
      return 0;
    }

    return -1;
  }, [activeConversation, items.length]);
  const hasBoundary = boundaryIndex >= 0 && boundaryIndex === messageIndex;
  const ownerState = React.useMemo<UnreadMarkerOwnerState>(
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
      ...getDataAttributes({
        hasBoundary: ownerState.hasBoundary,
      }),
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
}) as UnreadMarkerComponent;
