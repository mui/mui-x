'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessage } from '@mui/x-chat-headless';
import { useChatVariant } from '../chat/internals/ChatVariantContext';
import { MessageContextProvider } from './internals/MessageContext';
import { type MessageRootOwnerState } from './message.types';

export interface MessageRootSlots {
  root: React.ElementType;
}

export interface MessageRootSlotProps {
  root?: SlotComponentProps<'div', {}, MessageRootOwnerState>;
}

export interface MessageRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  messageId: string;
  isGrouped?: boolean;
  slots?: Partial<MessageRootSlots>;
  slotProps?: MessageRootSlotProps;
}

type MessageRootComponent = ((
  props: MessageRootProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const MessageRoot = React.forwardRef(function MessageRoot(
  props: MessageRootProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { messageId, isGrouped = false, slots, slotProps, children, ...other } = props;
  const message = useMessage(messageId);
  const variant = useChatVariant();
  const ownerState = React.useMemo<MessageRootOwnerState>(
    () => ({
      messageId,
      message,
      role: message?.role,
      status: message?.status,
      streaming: message?.status === 'streaming',
      error: message?.status === 'error',
      isGrouped,
      variant,
    }),
    [isGrouped, message, messageId, variant],
  );
  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      // `article` is the correct landmark for a self-contained unit of content
      // (each chat message is a discrete piece of content in a feed).
      // Screen readers announce "article" when entering, which helps users
      // understand the structural boundary between messages.
      role: 'article',
    },
  });

  return (
    <MessageContextProvider value={ownerState}>
      <Root {...rootProps}>{children}</Root>
    </MessageContextProvider>
  );
}) as MessageRootComponent;
