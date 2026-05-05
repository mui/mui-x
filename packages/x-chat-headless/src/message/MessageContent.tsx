'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useChatPartRenderer } from '../hooks/useChatPartRenderer';
import type { ChatMessagePart, ChatStepStartMessagePart } from '../types/chat-message-parts';
import type { ChatPartRenderer } from '../renderers/chatPartRenderer';
import { useChatOnToolCall } from '../hooks/useChatOnToolCall';
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
  content?: SlotComponentPropsFromProps<'div', {}, MessageContentOwnerState>;
  bubble?: SlotComponentPropsFromProps<'div', {}, MessageContentOwnerState>;
}

export interface TextPartExternalProps {
  /**
   * Custom renderer for text message parts.
   * When provided, this overrides the default plain-text rendering and
   * receives the raw text string (e.g. for markdown-to-JSX conversion).
   * @param {string} text The raw text content of the message part.
   * @returns {React.ReactNode} The rendered text content.
   */
  renderText?: (text: string) => React.ReactNode;
}

export interface MessageContentPartProps {
  text?: TextPartExternalProps;
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
   * @param {ChatMessagePart} part The message part to resolve a renderer for.
   * @param {ChatLocaleText} localeText The locale text for the chat.
   * @returns {ChatPartRenderer<ChatMessagePart> | null} A renderer or null.
   */
  resolveBuiltInPartRenderer?: (
    part: ChatMessagePart,
    localeText: ChatLocaleText,
  ) => ChatPartRenderer<ChatMessagePart> | null;
  /**
   * Content rendered inside the bubble after the message parts.
   * Useful for placing inline metadata (e.g. timestamp, status) inside the bubble.
   */
  afterContent?: React.ReactNode;
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

function TextPart(props: { text: string; renderText: (text: string) => React.ReactNode }) {
  const { text, renderText } = props;
  const rendered = React.useMemo(() => renderText(text), [text, renderText]);
  return <React.Fragment>{rendered}</React.Fragment>;
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
      if (partProps?.text?.renderText) {
        return <TextPart text={part.text} renderText={partProps.text.renderText} />;
      }
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
    afterContent,
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
        {afterContent}
      </Bubble>
    </Content>
  );
}) as MessageContentComponent;
