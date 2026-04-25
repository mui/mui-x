import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatMessageChunk,
  ChatStreamEnvelope,
  ChatUser,
} from '@mui/x-chat/headless';

let counter = 0;

/**
 * Generate an identifier suitable for demo data (messages, conversations, etc.).
 *
 * IMPORTANT: this generator is intentionally **deterministic** so identifiers
 * produced at module load time match between the SSR pass and the client
 * hydration pass — `crypto.randomUUID()` and `Date.now()` would both produce
 * different values on server and client, breaking React hydration whenever a
 * demo seeds its store at the module top level (Playwright Bug A).
 *
 * Demos are not real apps; the absence of true randomness has no security
 * implications and makes the docs preview reproducible.
 */
export function randomId(): string {
  counter += 1;
  return `demo-id-${counter.toString(36)}`;
}

/**
 * Explicit alias for callers that want to make the deterministic intent
 * obvious at the call site (e.g. when generating seed IDs at module load).
 */
export const deterministicId = randomId;

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
  options: { delayMs?: number } = {},
) {
  const { delayMs = 170 } = options;

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

export function getMessageText(message: ChatMessage) {
  return message.parts
    .map((part) => {
      if (part.type === 'text' || part.type === 'reasoning') {
        return part.text;
      }

      if (part.type === 'file') {
        return part.filename ?? part.url;
      }

      return JSON.stringify(part);
    })
    .join('\n');
}

export function createEchoAdapter(
  options: {
    agent?: ChatUser;
    delayMs?: number;
    respond?: (text: string) => string;
  } = {},
): ChatAdapter {
  const { agent } = options;
  const agentName = agent?.displayName ?? 'Assistant';
  const delayMs = options.delayMs ?? 170;
  const respond =
    options.respond ??
    ((text: string) =>
      `${agentName} received "${text}". Material UI styles applied automatically from the active theme.`);

  return {
    async sendMessage({ message }) {
      const textOnly = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');
      const responseText = respond(textOnly || getMessageText(message));

      return createChunkStream(
        createTextResponseChunks(randomId(), responseText, agent ? { author: agent } : undefined),
        { delayMs },
      );
    },
  };
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
