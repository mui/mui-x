'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useMessage } from '../hooks/useMessage';
import { useChatVariant } from '../chat/internals/ChatVariantContext';
import { useChatDensity } from '../chat/internals/ChatDensityContext';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { MessageContextProvider } from './internals/MessageContext';
import { type MessageRootOwnerState } from './message.types';

export interface MessageRootSlots {
  root: React.ElementType;
}

export interface MessageRootSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, MessageRootOwnerState>;
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
  const density = useChatDensity();
  const localeText = useChatLocaleText();
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
      density,
      showAvatar: message?.author?.avatarUrl != null,
    }),
    [density, isGrouped, message, messageId, variant],
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
      'aria-label': message?.author?.displayName
        ? `Message from ${message.author.displayName}`
        : localeText.messageLabel,
      ...getDataAttributes({
        role: ownerState.role,
        status: ownerState.status,
        streaming: ownerState.streaming,
        error: ownerState.error,
        isGrouped: ownerState.isGrouped,
      }),
    },
  });

  return (
    <MessageContextProvider value={ownerState}>
      <Root {...rootProps}>{children}</Root>
    </MessageContextProvider>
  );
}) as MessageRootComponent;
