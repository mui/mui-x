'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import {
  useChatPartRenderer,
  type ChatMessagePart,
  type ChatPartRenderer,
  type ChatStepStartMessagePart,
} from '@mui/x-chat-headless';
import { useChatOnToolCall } from '@mui/x-chat-headless/hooks';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import type { ChatLocaleText } from '../chat/internals/chatLocaleText';
import { useMessageContext } from './internals/MessageContext';
import { type MessageContentOwnerState } from './message.types';
import { FilePart, type FilePartExternalProps } from './parts/FilePart';
import { ReasoningPart, type ReasoningPartExternalProps } from './parts/ReasoningPart';
import {
  SourceDocumentPart,
  type SourceDocumentPartExternalProps,
} from './parts/SourceDocumentPart';
import { SourceUrlPart, type SourceUrlPartExternalProps } from './parts/SourceUrlPart';
import { ToolPart, type ToolPartExternalProps } from './parts/ToolPart';

export interface MessageContentSlots {
  content: React.ElementType;
  bubble: React.ElementType;
}

export interface MessageContentSlotProps {
  content?: SlotComponentProps<'div', {}, MessageContentOwnerState>;
  bubble?: SlotComponentProps<'div', {}, MessageContentOwnerState>;
}

export interface MessageContentPartProps {
  text?: Record<string, unknown>;
  reasoning?: ReasoningPartExternalProps;
  tool?: ToolPartExternalProps;
  'dynamic-tool'?: ToolPartExternalProps;
  file?: FilePartExternalProps;
  'source-url'?: SourceUrlPartExternalProps;
  'source-document'?: SourceDocumentPartExternalProps;
}

export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Props forwarded to the built-in unstyled part renderer components.
   * Use this to pass `slots` and `slotProps` to individual part type renderers.
   */
  partProps?: MessageContentPartProps;
  /**
   * @deprecated Use `partProps` instead.
   * Callback to resolve a built-in part renderer for a given part type.
   */
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

const renderDefaultStepStartPart: ChatPartRenderer<ChatStepStartMessagePart> = () => (
  <div role="separator" />
);

const renderDefaultDataPart: ChatPartRenderer<
  Extract<ChatMessagePart, { type: `data-${string}` }>
> = ({ part }) => <JsonBlock value={part.data} />;

function MessageRenderedPart(props: {
  part: ChatMessagePart;
  index: number;
  message: NonNullable<MessageContentOwnerState['message']>;
  partProps?: MessageContentPartProps;
  resolveBuiltInPartRenderer?: (
    part: ChatMessagePart,
    localeText: ChatLocaleText,
  ) => ChatPartRenderer<ChatMessagePart> | null;
}) {
  const { part, index, message, partProps, resolveBuiltInPartRenderer } = props;
  const customRenderer = useChatPartRenderer(part.type as ChatMessagePart['type']);
  const localeText = useChatLocaleText();
  const onToolCall = useChatOnToolCall();

  // Priority 1: User-provided custom renderer from ChatProvider
  if (customRenderer != null) {
    return <React.Fragment>{customRenderer({ part, message, index, onToolCall })}</React.Fragment>;
  }

  // Priority 2: Legacy resolveBuiltInPartRenderer callback (deprecated)
  if (resolveBuiltInPartRenderer != null) {
    const builtInRenderer = resolveBuiltInPartRenderer(part, localeText);

    if (builtInRenderer != null) {
      return (
        <React.Fragment>{builtInRenderer({ part, message, index, onToolCall })}</React.Fragment>
      );
    }
  }

  // Priority 3: Built-in unstyled part renderer components with partProps
  const baseProps = { part, message, index, onToolCall };
  switch (part.type) {
    case 'text':
      // Text part: simple div renderer, can be overridden via partProps or custom renderer.
      // Material layer overrides this with markdown rendering.
      return <div>{part.text}</div>;
    case 'reasoning':
      return <ReasoningPart {...partProps?.reasoning} {...baseProps} part={part} />;
    case 'tool':
      return <ToolPart {...partProps?.tool} {...baseProps} part={part} />;
    case 'dynamic-tool':
      return <ToolPart {...partProps?.['dynamic-tool']} {...baseProps} part={part} />;
    case 'file':
      return <FilePart {...partProps?.file} {...baseProps} part={part} />;
    case 'source-url':
      return <SourceUrlPart {...partProps?.['source-url']} {...baseProps} part={part} />;
    case 'source-document':
      return <SourceDocumentPart {...partProps?.['source-document']} {...baseProps} part={part} />;
    case 'step-start':
      return <React.Fragment>{renderDefaultStepStartPart(baseProps as any)}</React.Fragment>;
    default:
      if (part.type.startsWith('data-')) {
        return <React.Fragment>{renderDefaultDataPart(baseProps as any)}</React.Fragment>;
      }

      return <DefaultPartFallback part={part} />;
  }
}

export const MessageContent = React.forwardRef(function MessageContent(
  props: MessageContentProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    partProps,
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
          ? message.parts.map((part, idx) => (
              <MessageRenderedPart
                part={part}
                index={idx}
                key={`${ownerState.messageId}-${idx}-${part.type}`}
                message={message}
                partProps={partProps}
                resolveBuiltInPartRenderer={resolveBuiltInPartRenderer}
              />
            ))
          : null}
      </Bubble>
    </Content>
  );
}) as MessageContentComponent;
