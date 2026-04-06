import type { ChatMessage, ChatMessageChunk, ChatStreamEnvelope } from '@mui/x-chat-headless';

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
