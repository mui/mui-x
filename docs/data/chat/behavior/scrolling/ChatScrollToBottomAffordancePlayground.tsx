import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ChatMessageList, ChatScrollToBottomAffordance } from '@mui/x-chat';
import {
  useChat,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
} from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { MessageBubble } from 'docs/src/modules/components/chat-playground/MessageBubble';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation: ChatConversation = {
  id: 'scroll-playground',
  title: 'Scroll preview',
  participants: [users.me, users.assistant],
};

function buildMessages(count: number): ChatMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `scroll-msg-${i}`,
    conversationId: conversation.id,
    role: (i % 2 === 0 ? 'assistant' : 'user') as 'assistant' | 'user',
    author: i % 2 === 0 ? users.assistant : users.me,
    createdAt: new Date(Date.UTC(2026, 4, 3, 9, 0, i)).toISOString(),
    status: 'read',
    parts: [{ type: 'text', text: `Message ${i + 1} of ${count}` }],
  }));
}

type ScrollBehavior = 'auto' | 'instant' | 'smooth';

type ClassKey = 'root';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The floating affordance button.' },
];

/**
 * Reads the live message ids from the store so a runtime-appended message
 * (emitted as a `message-added` realtime event) shows up as a pure append —
 * which is what lets `unseenMessageCount` grow and the badge appear while the
 * user is scrolled up. Items must come from live state, never the seed array.
 */
function ScrollPreview({ scrollBehavior, buttonSx }: ScrollPreviewProps) {
  const { messages: liveMessages } = useChat();
  return (
    <Box
      sx={{
        width: '100%',
        height: 360,
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <ChatMessageList
        items={liveMessages.map((m) => m.id)}
        autoScroll={false}
        renderItem={({ id }) => <MessageBubble key={id} messageId={id} />}
        overlay={
          <ChatScrollToBottomAffordance
            scrollBehavior={scrollBehavior}
            sx={buttonSx as any}
          />
        }
      />
    </Box>
  );
}

interface ScrollPreviewProps {
  scrollBehavior: ScrollBehavior;
  buttonSx: unknown;
}

export default function ChatScrollToBottomAffordancePlayground() {
  const [count, setCount] = React.useState(20);
  const [scrollBehavior, setScrollBehavior] =
    React.useState<ScrollBehavior>('smooth');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);
  const messages = React.useMemo(() => buildMessages(count), [count]);

  const buttonSx = classesCustomizations.toClassesSx();

  // Channel for pushing a runtime message into live chat state. The adapter
  // captures `onEvent` on subscribe; the "Append message" button below emits a
  // `message-added` event through it so the new message lands in the store
  // without remounting the provider (the adapter is not part of the seed key).
  const onEventRef = React.useRef<((event: any) => void) | null>(null);
  const appendCountRef = React.useRef(0);

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.close();
          },
        });
      },
      subscribe({ onEvent }) {
        onEventRef.current = onEvent;
        return () => {
          onEventRef.current = null;
        };
      },
    }),
    [],
  );

  const appendMessage = React.useCallback(() => {
    appendCountRef.current += 1;
    const n = appendCountRef.current;
    const message: ChatMessage = {
      id: `scroll-extra-${n}`,
      conversationId: conversation.id,
      role: 'assistant',
      author: users.assistant,
      createdAt: new Date(Date.UTC(2026, 4, 3, 10, 0, n)).toISOString(),
      status: 'read',
      parts: [
        {
          type: 'text',
          text: `New message #${n} arrived while you were scrolled up.`,
        },
      ],
    };
    onEventRef.current?.({ type: 'message-added', message });
  }, []);

  return (
    <PlaygroundCard
      title="ChatScrollToBottomAffordance"
      description="Floating jump-to-latest button — appears once the user scrolls away from the bottom."
      previewMinHeight={360}
      span={2}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <ChoiceControl<ScrollBehavior>
            label="scrollBehavior"
            value={scrollBehavior}
            options={['smooth', 'auto', 'instant'] as const}
            onChange={setScrollBehavior}
            helperText="ScrollIntoView behavior used when the button is clicked."
          />
          <DividerLabel>fixture data</DividerLabel>
          <NumberControl
            label="message count"
            value={count}
            min={5}
            max={60}
            // Changing the seed re-mounts the provider (see ScopedChat), which
            // discards any runtime-appended messages and resets scroll state.
            onChange={setCount}
          />
          <Button variant="outlined" size="small" onClick={appendMessage}>
            Append message
          </Button>
          <Alert severity="info" sx={{ fontSize: '0.75rem', py: 0 }}>
            Scroll up inside the preview to make the affordance appear. Auto-scroll
            is disabled in this preview so the affordance stays reachable. Append
            messages while scrolled up to see the unseen-count badge.
          </Alert>
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={messages}
          activeConversationId={conversation.id}
          adapter={adapter}
        >
          <ScrollPreview scrollBehavior={scrollBehavior} buttonSx={buttonSx} />
        </ScopedChat>
      }
    />
  );
}
