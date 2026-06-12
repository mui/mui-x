import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { ChatMessageList, ChatScrollToBottomAffordance } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
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

export default function ChatScrollToBottomAffordancePlayground() {
  const [count, setCount] = React.useState(20);
  const [scrollBehavior, setScrollBehavior] =
    React.useState<ScrollBehavior>('smooth');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);
  const messages = React.useMemo(() => buildMessages(count), [count]);

  const buttonSx = classesCustomizations.toClassesSx();

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
            onChange={setCount}
          />
          <Alert severity="info" sx={{ fontSize: '0.75rem', py: 0 }}>
            Scroll up inside the preview to make the affordance appear.
          </Alert>
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={messages}
          activeConversationId={conversation.id}
        >
          <Box
            sx={{
              width: '100%',
              height: 360,
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <ChatMessageList
              items={messages.map((m) => m.id)}
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
        </ScopedChat>
      }
    />
  );
}
