import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
  ChatStreamEnvelope,
  ChatUser,
} from '@mui/x-chat/headless';

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function splitText(text: string, size = 18) {
  const chunks: string[] = [];

  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }

  return chunks.length === 0 ? [''] : chunks;
}

export function createTextResponseChunks(
  messageId: string,
  text: string,
  options?: { finishReason?: string; author?: ChatUser },
): ChatMessageChunk[] {
  const finishReason = options?.finishReason ?? 'stop';
  const partId = `${messageId}-text`;

  return [
    { type: 'start', messageId, ...(options?.author ? { author: options.author } : undefined) },
    { type: 'text-start', id: partId },
    ...splitText(text).map(
      (delta) =>
        ({
          type: 'text-delta',
          id: partId,
          delta,
        }) satisfies ChatMessageChunk,
    ),
    { type: 'text-end', id: partId },
    { type: 'finish', messageId, finishReason },
  ];
}

export function createChunkStream(
  chunks: Array<ChatMessageChunk | ChatStreamEnvelope>,
  options: {
    delayMs?: number;
    errorAfterChunk?: number;
    error?: Error;
  } = {},
) {
  const { delayMs = 180, errorAfterChunk, error = new Error('Demo stream failed.') } = options;

  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    start(controller) {
      let didFinish = false;

      chunks.forEach((chunk, index) => {
        setTimeout(
          () => {
            if (didFinish) {
              return;
            }

            if (errorAfterChunk != null && index === errorAfterChunk) {
              didFinish = true;
              controller.error(error);
              return;
            }

            controller.enqueue(chunk);

            if (index === chunks.length - 1) {
              didFinish = true;
              controller.close();
            }
          },
          delayMs * (index + 1),
        );
      });
    },
  });
}

export function getMessageText(message: ChatMessage) {
  return message.parts
    .map((part) => {
      if (part.type === 'text' || part.type === 'reasoning') {
        return part.text;
      }

      if (part.type === 'tool' || part.type === 'dynamic-tool') {
        return `${part.toolInvocation.toolName} (${part.toolInvocation.state})`;
      }

      if (part.type === 'file') {
        return part.filename ?? part.url;
      }

      if (part.type === 'source-url') {
        return part.title ?? part.url;
      }

      if (part.type === 'source-document') {
        return part.title ?? part.text ?? 'Source document';
      }

      if (part.type === 'step-start') {
        return 'Step started';
      }

      if (part.type.startsWith('data-') && 'data' in part) {
        return JSON.stringify(part.data);
      }

      return JSON.stringify(part);
    })
    .join('\n');
}

function formatWithOptions(value: string | undefined, options: Intl.DateTimeFormatOptions) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function formatConversationTime(value: string | undefined) {
  return formatWithOptions(value, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatMessageTime(value: string | undefined) {
  return formatWithOptions(value, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function createEchoAdapter(
  options: {
    agent?: ChatUser;
    delayMs?: number;
    respond?: (text: string, params: { attachments: number }) => string;
  } = {},
): ChatAdapter {
  const agent = options.agent ?? { id: 'assistant', displayName: 'Assistant' };
  const delayMs = options.delayMs ?? 170;
  const respond =
    options.respond ??
    ((text: string, params: { attachments: number }) =>
      `${agent.displayName ?? 'Assistant'} received "${text}". The unstyled primitives kept the structure while the headless runtime streamed this reply.${params.attachments > 0 ? ` I also received ${params.attachments} attachment${params.attachments === 1 ? '' : 's'}.` : ''}`);

  return {
    async sendMessage({ attachments, message }) {
      const textOnly = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');
      const responseText = respond(textOnly || getMessageText(message), {
        attachments: attachments?.length ?? 0,
      });

      return createChunkStream(
        createTextResponseChunks(`assistant-${message.id}`, responseText, { author: agent }),
        { delayMs },
      );
    },
  };
}

export function cloneConversations(conversations: ChatConversation[]) {
  return conversations.map((conversation) => ({
    ...conversation,
    participants: conversation.participants?.map((participant) => ({ ...participant })),
  }));
}

export function cloneMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({
    ...message,
    author: message.author ? { ...message.author } : undefined,
    parts: message.parts.map((part) => ({ ...part })) as ChatMessage['parts'],
  }));
}

export function cloneThreadMap(threads: Record<string, ChatMessage[]>) {
  return Object.fromEntries(
    Object.entries(threads).map(([conversationId, messages]) => [
      conversationId,
      cloneMessages(messages),
    ]),
  );
}

export function syncConversationPreview(
  conversations: ChatConversation[],
  conversationId: string,
  messages: ChatMessage[],
) {
  const lastMessage = messages[messages.length - 1];
  const preview =
    lastMessage == null ? undefined : getMessageText(lastMessage).split('\n')[0]?.slice(0, 70);

  return conversations.map((conversation) => {
    if (conversation.id !== conversationId) {
      return conversation;
    }

    return {
      ...conversation,
      subtitle: preview ?? conversation.subtitle,
      lastMessageAt: lastMessage?.createdAt ?? conversation.lastMessageAt,
    };
  });
}
