'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import {
  useChatPartRenderer,
  type ChatMessagePart,
  type ChatPartRenderer,
} from '@mui/x-chat-headless';
import { useChatOnToolCall } from '@mui/x-chat-headless/hooks';
import { useMessageContext } from './internals/MessageContext';
import { getDefaultMessagePartRenderer } from './internals/defaultMessagePartRenderers';
import { type MessageContentOwnerState } from './message.types';

export interface MessageContentSlots {
  root: React.ElementType;
}

export interface MessageContentSlotProps {
  root?: SlotComponentProps<'div', {}, MessageContentOwnerState>;
}

export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<MessageContentSlots>;
  slotProps?: MessageContentSlotProps;
}

type MessageContentComponent = ((
  props: MessageContentProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

function DefaultPartFallback(props: { part: ChatMessagePart }) {
  const { part } = props;

  return <div data-part-type={part.type} />;
}

function MessageRenderedPart(props: {
  part: ChatMessagePart;
  index: number;
  message: NonNullable<MessageContentOwnerState['message']>;
}) {
  const { part, index, message } = props;
  const customRenderer = useChatPartRenderer(part.type as ChatMessagePart['type']);
  const defaultRenderer = React.useMemo(
    () => getDefaultMessagePartRenderer(part),
    [part],
  );
  const onToolCall = useChatOnToolCall();
  const Renderer = (customRenderer ?? defaultRenderer) as ChatPartRenderer<ChatMessagePart> | null;

  if (Renderer == null) {
    return <DefaultPartFallback part={part} />;
  }

  return <React.Fragment>{Renderer({ part, message, index, onToolCall })}</React.Fragment>;
}

export const MessageContent = React.forwardRef(function MessageContent(
  props: MessageContentProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as MessageContentProps & { ownerState?: MessageContentOwnerState };
  const ownerState = useMessageContext();
  void ownerStateProp;
  const Root = slots?.root ?? 'div';
  const message = ownerState.message;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return (
    <Root {...rootProps}>
      {message
        ? message.parts.map((part, index) => (
            <MessageRenderedPart
              part={part}
              index={index}
              key={`${ownerState.messageId}-${index}-${part.type}`}
              message={message}
            />
          ))
        : null}
    </Root>
  );
}) as MessageContentComponent;
