import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatUnreadMarker } from '@mui/x-chat';

import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { MessageBubble } from 'docs/src/modules/components/chat-playground/MessageBubble';
import {
  DividerLabel,
  NumberControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const CONVERSATION_ID = 'unread-playground';

function buildMessages(count) {
  const base = Date.UTC(2026, 4, 3, 8, 30, 0);
  return Array.from({ length: count }, (_, i) => ({
    id: `unread-msg-${i}`,
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: users.assistant,
    createdAt: new Date(base + i * 60_000).toISOString(),
    status: i < Math.floor(count / 2) ? 'read' : 'sent',
    parts: [{ type: 'text', text: `Message ${i + 1}` }],
  }));
}

const CLASS_DEFS = [
  { name: 'root', description: 'The unread marker row.' },
  {
    name: 'label',
    selector: '.MuiChatUnreadMarker-label',
    description: 'The "New" label inside the divider.',
  },
];

export default function ChatUnreadMarkerPlayground() {
  const [count, setCount] = React.useState(4);
  const [boundary, setBoundary] = React.useState(2);
  const classesCustomizations = useCustomizations(CLASS_DEFS);
  const messages = React.useMemo(() => buildMessages(count), [count]);
  const safeBoundary = Math.min(boundary, count - 1);

  // The headless UnreadMarker derives its boundary from the conversation's
  // `unreadCount` (boundary = messageCount - unreadCount). Keep it in sync with
  // the slider so the marker renders at the selected index for any message count.
  const conversation = React.useMemo(
    () => ({
      id: CONVERSATION_ID,
      title: 'Unread thread',
      participants: [users.me, users.assistant],
      unreadCount: count - safeBoundary,
      readState: 'unread',
    }),
    [count, safeBoundary],
  );

  const markerSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatUnreadMarker"
      description="Divider rendered when a message sits at the unread boundary."
      previewMinHeight={260}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>fixture (thread shape)</DividerLabel>
          <NumberControl
            label="message count"
            value={count}
            min={2}
            max={6}
            onChange={setCount}
          />
          <NumberControl
            label="boundary index"
            value={safeBoundary}
            min={0}
            max={Math.max(0, count - 1)}
            onChange={setBoundary}
            helperText="Where the marker is rendered — drives messageId prop."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={messages}
          activeConversationId={conversation.id}
        >
          <Box sx={{ width: '100%' }}>
            {messages.map((message, i) => (
              <React.Fragment key={message.id}>
                {i === safeBoundary ? (
                  <ChatUnreadMarker messageId={message.id} sx={markerSx} />
                ) : null}
                <MessageBubble messageId={message.id} />
              </React.Fragment>
            ))}
          </Box>
        </ScopedChat>
      }
    />
  );
}
