'use client';
import { ChatBox } from '@mui/x-chat';
import { createAiSdkAdapter } from '@mui/x-chat/headless';
import type { AiSdkUIMessageChunk, ChatMessage } from '@mui/x-chat/headless';

const CONVERSATION_ID = 'ai-sdk-mock';

const initialConversations = [{ id: CONVERSATION_ID, title: 'Mock stream' }];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      {
        type: 'text' as const,
        text: 'Type anything — I stream the reply back word by word, like the AI SDK UI Message Stream.',
      },
    ],
  },
];

function getMessageText(message: ChatMessage) {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('');
}

function replyFor(message: ChatMessage) {
  const text = getMessageText(message).trim() || 'nothing';
  return `You said: «${text}» — this reply was streamed as AI SDK UI-message chunks, no \`ai\` package involved.`;
}

// Builds a ReadableStream of AI SDK UI Message Stream chunks, enqueuing one
// `text-delta` per word on a timer so the reply streams in visibly. The
// `start`/`finish` chunks deliberately omit `messageId`, exercising the
// adapter's synthetic-ID path.
function buildMockUiMessageStream(
  text: string,
): ReadableStream<AiSdkUIMessageChunk> {
  const words = text.split(' ');
  let index = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new ReadableStream<AiSdkUIMessageChunk>({
    start(controller) {
      controller.enqueue({ type: 'start' });
      controller.enqueue({ type: 'text-start', id: 'reply-text' });

      const pushWord = () => {
        if (index >= words.length) {
          controller.enqueue({ type: 'text-end', id: 'reply-text' });
          controller.enqueue({ type: 'finish' });
          controller.close();
          return;
        }
        const delta = index === 0 ? words[index] : ` ${words[index]}`;
        controller.enqueue({ type: 'text-delta', id: 'reply-text', delta });
        index += 1;
        timer = setTimeout(pushWord, 40);
      };

      timer = setTimeout(pushWord, 40);
    },
    cancel() {
      if (timer) {
        clearTimeout(timer);
      }
    },
  });
}

const adapter = createAiSdkAdapter({
  stream: ({ message }) => buildMockUiMessageStream(replyFor(message)),
});

export default function AiSdkMockStreamDemo() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      variant="compact"
      sx={{
        height: 480,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
