'use client';
import { ChatBox } from '@mui/x-chat';

const CONVERSATION_ID = 'quickstart';
const assistant = {
  id: 'assistant',
  displayName: 'Assistant',
  role: 'assistant',
};

const initialConversations = [
  {
    id: CONVERSATION_ID,
    title: 'Assistant',
    participants: [assistant],
  },
];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    status: 'sent',
    author: assistant,
    parts: [
      {
        type: 'text',
        text: 'Hello! Send a message to see a streaming response.',
      },
    ],
  },
];

function splitText(text, size = 18) {
  const chunks = [];

  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }

  return chunks.length === 0 ? [''] : chunks;
}

function createResponseChunks(messageId, text) {
  const partId = `${messageId}-text`;

  return [
    {
      type: 'start',
      messageId,
      author: assistant,
    },
    { type: 'text-start', id: partId },
    ...splitText(text).map((delta) => ({
      type: 'text-delta',
      id: partId,
      delta,
    })),
    { type: 'text-end', id: partId },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];
}

const adapter = {
  async sendMessage({ message, signal }) {
    const text = message.parts
      .map((part) => (part.type === 'text' ? part.text : null))
      .filter(Boolean)
      .join('\n');

    const responseText =
      `You said: "${text || 'Hello'}". ` +
      'Replace this demo adapter with your own API call.';

    return new ReadableStream({
      start(controller) {
        const chunks = createResponseChunks(`reply-${message.id}`, responseText);
        const timeouts = chunks.map((chunk, index) =>
          setTimeout(
            () => {
              if (signal.aborted) {
                return;
              }

              controller.enqueue(chunk);

              if (index === chunks.length - 1) {
                controller.close();
              }
            },
            120 * (index + 1),
          ),
        );

        signal.addEventListener(
          'abort',
          () => {
            timeouts.forEach(clearTimeout);
            controller.close();
          },
          { once: true },
        );
      },
    });
  },
};

export default function RenderChatBox() {
  return (
    <ChatBox
      adapter={adapter}
      initialConversations={initialConversations}
      initialActiveConversationId={CONVERSATION_ID}
      initialMessages={initialMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
