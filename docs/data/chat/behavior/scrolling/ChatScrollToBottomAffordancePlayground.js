import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { ChatMessageList, ChatScrollToBottomAffordance } from '@mui/x-chat';
import { useChat, useChatStore } from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { MessageBubble } from 'docs/src/modules/components/chat-playground/MessageBubble';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation = {
  id: 'scroll-playground',
  title: 'Scroll preview',
  participants: [users.me, users.assistant],
};

function buildMessages(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `scroll-msg-${i}`,
    conversationId: conversation.id,
    role: i % 2 === 0 ? 'assistant' : 'user',
    author: i % 2 === 0 ? users.assistant : users.me,
    createdAt: new Date(Date.UTC(2026, 4, 3, 9, 0, i)).toISOString(),
    status: 'read',
    parts: [{ type: 'text', text: `Message ${i + 1} of ${count}` }],
  }));
}

function buildAppendedMessage(n) {
  return {
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
}

const CLASS_DEFS = [
  { name: 'root', description: 'The floating affordance button.' },
];

/**
 * Renders the live message list and appends a message on demand.
 *
 * The list is fed from live store state (`useChat().messages`), not the seed
 * array, so an appended message shows up as a pure append — which is what grows
 * the affordance's `unseenMessageCount` badge while the user is scrolled up.
 *
 * `appendRequest` is a counter owned by the parent (bumped by the "Append
 * message" button). Adding a message to a chat is a store operation, so we call
 * the public `useChatStore().addMessage()` from inside the provider rather than
 * plumbing a callback back out to the button. Each new counter value appends one
 * assistant message; `addMessage` is idempotent per id, so re-runs are harmless.
 */
function ScrollPreview({ scrollBehavior, buttonSx, appendRequest }) {
  const { messages: liveMessages } = useChat();
  const store = useChatStore();

  React.useEffect(() => {
    if (appendRequest > 0) {
      store.addMessage(buildAppendedMessage(appendRequest));
    }
  }, [store, appendRequest]);

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
            sx={buttonSx}
          />
        }
      />
    </Box>
  );
}

export default function ChatScrollToBottomAffordancePlayground() {
  const [count, setCount] = React.useState(20);
  const [scrollBehavior, setScrollBehavior] = React.useState('smooth');
  // Bumped by the "Append message" button; consumed by `ScrollPreview` inside
  // the provider to append one message to the live store.
  const [appendRequest, setAppendRequest] = React.useState(0);
  const classesCustomizations = useCustomizations(CLASS_DEFS);
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
          <ChoiceControl
            label="scrollBehavior"
            value={scrollBehavior}
            options={['smooth', 'auto', 'instant']}
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
            // discards any appended messages and resets scroll state. Reset the
            // append counter to match so the fresh provider starts clean.
            onChange={(next) => {
              setCount(next);
              setAppendRequest(0);
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => setAppendRequest((prev) => prev + 1)}
          >
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
        >
          <ScrollPreview
            scrollBehavior={scrollBehavior}
            buttonSx={buttonSx}
            appendRequest={appendRequest}
          />
        </ScopedChat>
      }
    />
  );
}
