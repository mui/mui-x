'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageError } from '../hooks/useMessageError';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';
import { useMessageContext } from './internals/MessageContext';
import { type MessageErrorOwnerState } from './message.types';

export interface MessageErrorSlots {
  /**
   * The root element of the per-message error primitive.
   * Rendered with `role="alert"` so screen readers announce the error.
   */
  root: React.ElementType;
}

export interface MessageErrorSlotProps {
  root?: SlotComponentProps<'div', {}, MessageErrorOwnerState>;
}

export interface MessageErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<MessageErrorSlots>;
  slotProps?: MessageErrorSlotProps;
  children?: React.ReactNode;
}

type MessageErrorComponent = ((
  props: MessageErrorProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const MessageError = React.forwardRef(function MessageError(
  props: MessageErrorProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    children,
    ...other
  } = props as MessageErrorProps & { ownerState?: MessageErrorOwnerState };
  void ownerStateProp;
  const messageContext = useMessageContext();
  const { messageId } = messageContext;
  const chatError = useMessageError(messageId);
  const runtime = useChatRuntimeContext(true);

  const retry = React.useCallback(async () => {
    if (!runtime || !messageId) {
      return;
    }
    await runtime.actions.retry(messageId);
  }, [runtime, messageId]);

  const ownerState = React.useMemo<MessageErrorOwnerState>(
    () => ({
      ...messageContext,
      chatError,
      retryable: chatError?.retryable ?? false,
      retry,
    }),
    [messageContext, chatError, retry],
  );

  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: chatError ? slotProps?.root : undefined,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      role: 'alert',
    },
  });

  if (!chatError) {
    return null;
  }

  return <Root {...rootProps}>{children ?? chatError.message}</Root>;
}) as MessageErrorComponent;
