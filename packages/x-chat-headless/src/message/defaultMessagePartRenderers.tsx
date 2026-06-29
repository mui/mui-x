'use client';
import * as React from 'react';
import type {
  ChatDynamicToolMessagePart,
  ChatFileMessagePart,
  ChatMessagePart,
  ChatReasoningMessagePart,
  ChatSourceDocumentMessagePart,
  ChatSourceUrlMessagePart,
  ChatStepStartMessagePart,
  ChatTextMessagePart,
  ChatToolMessagePart,
} from '../types/chat-message-parts';
import type { ChatPartRenderer } from '../renderers/chatPartRenderer';

function JsonBlock(props: { value: unknown }) {
  const { value } = props;

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

export const renderDefaultTextPart: ChatPartRenderer<ChatTextMessagePart> = ({ part }) => (
  <div>{part.text}</div>
);

export const renderDefaultReasoningPart: ChatPartRenderer<ChatReasoningMessagePart> = ({
  part,
}) => (
  <details>
    <summary>Reasoning</summary>
    <div>{part.text}</div>
  </details>
);

function ToolRenderer(props: { part: ChatToolMessagePart | ChatDynamicToolMessagePart }) {
  const { part } = props;
  const { toolInvocation } = part;

  return (
    <div>
      <div>{toolInvocation.title ?? toolInvocation.toolName}</div>
      <div>{toolInvocation.state}</div>
      {toolInvocation.input !== undefined ? <JsonBlock value={toolInvocation.input} /> : null}
      {toolInvocation.output !== undefined ? <JsonBlock value={toolInvocation.output} /> : null}
      {toolInvocation.approval !== undefined ? <JsonBlock value={toolInvocation.approval} /> : null}
      {toolInvocation.errorText ? <div>{toolInvocation.errorText}</div> : null}
    </div>
  );
}

export const renderDefaultToolPart: ChatPartRenderer<ChatToolMessagePart> = ({ part }) => (
  <ToolRenderer part={part} />
);

export const renderDefaultDynamicToolPart: ChatPartRenderer<ChatDynamicToolMessagePart> = ({
  part,
}) => <ToolRenderer part={part} />;

export const renderDefaultFilePart: ChatPartRenderer<ChatFileMessagePart> = ({ part }) => {
  if (part.mediaType.startsWith('image/')) {
    return <img alt={part.filename ?? ''} src={part.url} />;
  }

  return <a href={part.url}>{part.filename ?? part.url}</a>;
};

export const renderDefaultSourceUrlPart: ChatPartRenderer<ChatSourceUrlMessagePart> = ({
  part,
}) => <a href={part.url}>{part.title ?? part.url}</a>;

export const renderDefaultSourceDocumentPart: ChatPartRenderer<ChatSourceDocumentMessagePart> = ({
  part,
}) => (
  <div>
    {part.title ? <div>{part.title}</div> : null}
    {part.text ? <div>{part.text}</div> : null}
  </div>
);

export const renderDefaultStepStartPart: ChatPartRenderer<ChatStepStartMessagePart> = () => (
  <div role="separator" />
);

export const renderDefaultDataPart: ChatPartRenderer<
  Extract<ChatMessagePart, { type: `data-${string}` }>
> = ({ part }) => <JsonBlock value={part.data} />;

export function getDefaultMessagePartRenderer(part: ChatMessagePart): ChatPartRenderer<any> | null {
  switch (part.type) {
    case 'text':
      return renderDefaultTextPart;
    case 'reasoning':
      return renderDefaultReasoningPart;
    case 'tool':
      return renderDefaultToolPart;
    case 'dynamic-tool':
      return renderDefaultDynamicToolPart;
    case 'file':
      return renderDefaultFilePart;
    case 'source-url':
      return renderDefaultSourceUrlPart;
    case 'source-document':
      return renderDefaultSourceDocumentPart;
    case 'step-start':
      return renderDefaultStepStartPart;
    default:
      return part.type.startsWith('data-') ? renderDefaultDataPart : null;
  }
}
