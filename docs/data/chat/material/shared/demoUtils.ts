import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
  ChatStreamEnvelope,
} from '@mui/x-chat-headless';

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
  finishReason = 'stop',
): ChatMessageChunk[] {
  const partId = `${messageId}-text`;

  return [
    { type: 'start', messageId },
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
  options: { delayMs?: number } = {},
) {
  const { delayMs = 150 } = options;

  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    start(controller) {
      let didFinish = false;

      chunks.forEach((chunk, index) => {
        setTimeout(
          () => {
            if (didFinish) {
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

function getMessageText(message: ChatMessage) {
  return message.parts
    .map((part) => {
      if (part.type === 'text' || part.type === 'reasoning') {
        return part.text;
      }

      return '';
    })
    .join(' ')
    .trim();
}

export function createEchoAdapter(
  options: {
    delayMs?: number;
    respond?: (text: string) => string;
  } = {},
): ChatAdapter {
  const delayMs = options.delayMs ?? 150;
  const respond =
    options.respond ??
    ((text: string) =>
      `I received your message: "${text}". This is a simulated response from the Material UI ChatBox demo.`);

  return {
    async sendMessage({ message }) {
      const responseText = respond(getMessageText(message));

      return createChunkStream(createTextResponseChunks(`assistant-${message.id}`, responseText), {
        delayMs,
      });
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
