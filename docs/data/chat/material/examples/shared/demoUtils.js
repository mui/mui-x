let counter = 0;

/**
 * Generate a random identifier suitable for demo data (messages, conversations, etc.).
 * Uses `crypto.randomUUID` when available; falls back to a timestamp + counter combo.
 */
export function randomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function splitText(text, size = 18) {
  const chunks = [];

  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }

  return chunks.length === 0 ? [''] : chunks;
}

export function createTextResponseChunks(messageId, text, options) {
  const finishReason = options?.finishReason ?? 'stop';
  const partId = `${messageId}-text`;

  return [
    {
      type: 'start',
      messageId,
      ...(options?.author ? { author: options.author } : undefined),
    },
    { type: 'text-start', id: partId },
    ...splitText(text).map((delta) => ({
      type: 'text-delta',
      id: partId,
      delta,
    })),
    { type: 'text-end', id: partId },
    { type: 'finish', messageId, finishReason },
  ];
}

export function createChunkStream(chunks, options = {}) {
  const { delayMs = 170 } = options;

  return new ReadableStream({
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

export function getMessageText(message) {
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

export function createEchoAdapter(options = {}) {
  const { agent } = options;
  const agentName = agent?.displayName ?? 'Assistant';
  const delayMs = options.delayMs ?? 170;
  const respond =
    options.respond ??
    ((text) =>
      `${agentName} received "${text}". Material UI styles applied automatically from the active theme.`);

  return {
    async sendMessage({ message }) {
      const textOnly = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');
      const responseText = respond(textOnly || getMessageText(message));

      return createChunkStream(
        createTextResponseChunks(
          randomId(),
          responseText,
          agent ? { author: agent } : undefined,
        ),
        { delayMs },
      );
    },
  };
}

export function syncConversationPreview(conversations, conversationId, messages) {
  const lastMessage = messages[messages.length - 1];
  const preview =
    lastMessage == null
      ? undefined
      : getMessageText(lastMessage).split('\n')[0]?.slice(0, 70);

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
