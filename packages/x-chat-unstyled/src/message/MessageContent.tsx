'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import {
  type ChatDynamicToolMessagePart,
  useChatPartRenderer,
  type ChatMessagePart,
  type ChatPartRenderer,
  type ChatReasoningMessagePart,
  type ChatToolMessagePart,
} from '@mui/x-chat-headless';
import { useChatOnToolCall } from '@mui/x-chat-headless/hooks';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import type { ChatLocaleText } from '../chat/internals/chatLocaleText';
import { getDefaultMessagePartRenderer } from './defaultMessagePartRenderers';
import { useMessageContext } from './internals/MessageContext';
import { type MessageContentOwnerState } from './message.types';

export interface MessageContentSlots {
  content: React.ElementType;
  bubble: React.ElementType;
}

export interface MessageContentSlotProps {
  content?: SlotComponentProps<'div', {}, MessageContentOwnerState>;
  bubble?: SlotComponentProps<'div', {}, MessageContentOwnerState>;
}

export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  resolveBuiltInPartRenderer?: (
    part: ChatMessagePart,
    localeText: ChatLocaleText,
  ) => ChatPartRenderer<ChatMessagePart> | null;
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

function JsonBlock(props: { value: unknown }) {
  const { value } = props;

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

function LocalizedReasoningPart(props: {
  localeText: ReturnType<typeof useChatLocaleText>;
  part: ChatReasoningMessagePart;
}) {
  const { localeText, part } = props;

  return (
    <details>
      <summary>{localeText.messageReasoningLabel}</summary>
      <div>{part.text}</div>
    </details>
  );
}

function LocalizedToolPart(props: {
  localeText: ReturnType<typeof useChatLocaleText>;
  part: ChatToolMessagePart | ChatDynamicToolMessagePart;
}) {
  const { localeText, part } = props;
  const { toolInvocation } = part;
  const stateLabel = localeText.toolStateLabel(toolInvocation.state);

  return (
    <div>
      <div>{toolInvocation.title ?? toolInvocation.toolName}</div>
      {stateLabel ? <div>{stateLabel}</div> : null}
      {toolInvocation.input !== undefined ? <JsonBlock value={toolInvocation.input} /> : null}
      {toolInvocation.output !== undefined ? <JsonBlock value={toolInvocation.output} /> : null}
      {toolInvocation.approval !== undefined ? <JsonBlock value={toolInvocation.approval} /> : null}
      {toolInvocation.errorText ? <div>{toolInvocation.errorText}</div> : null}
    </div>
  );
}

function createLocalizedReasoningRenderer(
  localeText: ReturnType<typeof useChatLocaleText>,
): ChatPartRenderer<ChatMessagePart> {
  return function LocalizedReasoningRenderer(renderProps) {
    return (
      <LocalizedReasoningPart
        localeText={localeText}
        part={renderProps.part as ChatReasoningMessagePart}
      />
    );
  };
}

function createLocalizedToolRenderer(
  localeText: ReturnType<typeof useChatLocaleText>,
): ChatPartRenderer<ChatMessagePart> {
  return function LocalizedToolRenderer(renderProps) {
    return (
      <LocalizedToolPart localeText={localeText} part={renderProps.part as ChatToolMessagePart} />
    );
  };
}

function createLocalizedDynamicToolRenderer(
  localeText: ReturnType<typeof useChatLocaleText>,
): ChatPartRenderer<ChatMessagePart> {
  return function LocalizedDynamicToolRenderer(renderProps) {
    return (
      <LocalizedToolPart
        localeText={localeText}
        part={renderProps.part as ChatDynamicToolMessagePart}
      />
    );
  };
}

function MessageRenderedPart(props: {
  part: ChatMessagePart;
  index: number;
  message: NonNullable<MessageContentOwnerState['message']>;
  resolveBuiltInPartRenderer?: (
    part: ChatMessagePart,
    localeText: ChatLocaleText,
  ) => ChatPartRenderer<ChatMessagePart> | null;
}) {
  const { part, index, message, resolveBuiltInPartRenderer } = props;
  const customRenderer = useChatPartRenderer(part.type as ChatMessagePart['type']);
  const localeText = useChatLocaleText();
  const localizedRenderer = React.useMemo<ChatPartRenderer<ChatMessagePart> | null>(() => {
    switch (part.type) {
      case 'reasoning':
        return createLocalizedReasoningRenderer(localeText);
      case 'tool':
        return createLocalizedToolRenderer(localeText);
      case 'dynamic-tool':
        return createLocalizedDynamicToolRenderer(localeText);
      default:
        return null;
    }
  }, [localeText, part.type]);
  const defaultRenderer = React.useMemo(() => getDefaultMessagePartRenderer(part), [part]);
  const builtInRenderer = React.useMemo(
    () => resolveBuiltInPartRenderer?.(part, localeText) ?? null,
    [localeText, part, resolveBuiltInPartRenderer],
  );
  const onToolCall = useChatOnToolCall();
  const Renderer = (customRenderer ??
    builtInRenderer ??
    localizedRenderer ??
    defaultRenderer) as ChatPartRenderer<ChatMessagePart> | null;

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
    resolveBuiltInPartRenderer,
    slots,
    slotProps,
    ...other
  } = props as MessageContentProps & { ownerState?: MessageContentOwnerState };
  const ownerState = useMessageContext();
  void ownerStateProp;
  const Content = slots?.content ?? 'div';
  const Bubble = slots?.bubble ?? 'div';
  const message = ownerState.message;
  const contentProps = useSlotProps({
    elementType: Content,
    externalSlotProps: slotProps?.content,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });
  const bubbleProps = useSlotProps({
    elementType: Bubble,
    externalSlotProps: slotProps?.bubble,
    ownerState,
  });

  return (
    <Content {...contentProps}>
      <Bubble {...bubbleProps}>
        {message
          ? message.parts.map((part, index) => (
              <MessageRenderedPart
                part={part}
                index={index}
                key={`${ownerState.messageId}-${index}-${part.type}`}
                message={message}
                resolveBuiltInPartRenderer={resolveBuiltInPartRenderer}
              />
            ))
          : null}
      </Bubble>
    </Content>
  );
}) as MessageContentComponent;
