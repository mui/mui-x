'use client';
import * as React from 'react';
import type {
  ChatDynamicToolMessagePart,
  ChatFileMessagePart,
  ChatMessagePart,
  ChatPartRenderer,
  ChatReasoningMessagePart,
  ChatSourceDocumentMessagePart,
  ChatSourceUrlMessagePart,
  ChatStepStartMessagePart,
  ChatTextMessagePart,
  ChatToolMessagePart,
} from '@mui/x-chat-headless';

function JsonBlock(props: { value: unknown }) {
  const { value } = props;

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

const renderTextPart: ChatPartRenderer<ChatTextMessagePart> = ({ part }) => <div>{part.text}</div>;

const renderReasoningPart: ChatPartRenderer<ChatReasoningMessagePart> = ({ part }) => (
  <details>
    <summary>Reasoning</summary>
    <div>{part.text}</div>
  </details>
);

function ToolRenderer(props: {
  part: ChatToolMessagePart | ChatDynamicToolMessagePart;
}) {
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

const renderToolPart: ChatPartRenderer<ChatToolMessagePart> = ({ part }) => <ToolRenderer part={part} />;

const renderDynamicToolPart: ChatPartRenderer<ChatDynamicToolMessagePart> = ({ part }) => (
  <ToolRenderer part={part} />
);

const renderFilePart: ChatPartRenderer<ChatFileMessagePart> = ({ part }) => {
  if (part.mediaType.startsWith('image/')) {
    return <img alt={part.filename ?? ''} src={part.url} />;
  }

  return <a href={part.url}>{part.filename ?? part.url}</a>;
};

const renderSourceUrlPart: ChatPartRenderer<ChatSourceUrlMessagePart> = ({ part }) => (
  <a href={part.url}>{part.title ?? part.url}</a>
);

const renderSourceDocumentPart: ChatPartRenderer<ChatSourceDocumentMessagePart> = ({ part }) => (
  <div>
    {part.title ? <div>{part.title}</div> : null}
    {part.text ? <div>{part.text}</div> : null}
  </div>
);

const renderStepStartPart: ChatPartRenderer<ChatStepStartMessagePart> = () => (
  <div role="separator" />
);

const renderDataPart: ChatPartRenderer<Extract<ChatMessagePart, { type: `data-${string}` }>> = ({ part }) => (
  <JsonBlock value={part.data} />
);

export function getDefaultMessagePartRenderer(
  part: ChatMessagePart,
): ChatPartRenderer<any> | null {
  switch (part.type) {
    case 'text':
      return renderTextPart;
    case 'reasoning':
      return renderReasoningPart;
    case 'tool':
      return renderToolPart;
    case 'dynamic-tool':
      return renderDynamicToolPart;
    case 'file':
      return renderFilePart;
    case 'source-url':
      return renderSourceUrlPart;
    case 'source-document':
      return renderSourceDocumentPart;
    case 'step-start':
      return renderStepStartPart;
    default:
      return part.type.startsWith('data-') ? renderDataPart : null;
  }
}
