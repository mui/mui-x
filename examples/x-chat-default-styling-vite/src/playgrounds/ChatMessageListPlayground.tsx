import * as React from 'react';
import { Box } from '@mui/material';
import { ChatMessageList } from '@mui/x-chat';
import type { ChatConversation, ChatDensity, ChatMessage, ChatVariant } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ChatChrome, ScopedChat } from './sharedProviders';
import { MessageBubble } from './MessageBubble';
import { ChoiceControl, NumberControl, SwitchControl } from './controls';
import { users } from '../data';

const conversation: ChatConversation = {
  id: 'list-playground',
  title: 'Message list',
  participants: [users.me, users.assistant, users.alice],
};

function buildMessages(messageCount: number, spanDays: boolean): ChatMessage[] {
  const baseDay = Date.UTC(2026, 4, 3, 9, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const authorRotation = [users.alice, users.assistant, users.me];
  return Array.from({ length: messageCount }, (_, i) => {
    const author = authorRotation[i % authorRotation.length];
    const role = author === users.assistant ? 'assistant' : 'user';
    const dayOffset = spanDays ? Math.floor(i / Math.max(1, Math.ceil(messageCount / 3))) : 0;
    const created = baseDay - dayOffset * dayMs + (i % 6) * 60_000;
    return {
      id: `list-msg-${i}`,
      conversationId: conversation.id,
      role,
      author,
      createdAt: new Date(created).toISOString(),
      status: 'read',
      parts: [
        {
          type: 'text',
          text: `Message ${i + 1} from ${author.displayName}.`,
        },
      ],
    } as ChatMessage;
  }).reverse();
}

const DEFAULTS = {
  count: 8,
  spanDays: true,
  autoScroll: true,
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
};

export function ChatMessageListPlayground() {
  const [count, setCount] = React.useState(DEFAULTS.count);
  const [spanDays, setSpanDays] = React.useState(DEFAULTS.spanDays);
  const [autoScroll, setAutoScroll] = React.useState(DEFAULTS.autoScroll);
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);

  const handleReset = React.useCallback(() => {
    setCount(DEFAULTS.count);
    setSpanDays(DEFAULTS.spanDays);
    setAutoScroll(DEFAULTS.autoScroll);
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
  }, []);

  const messages = React.useMemo(() => buildMessages(count, spanDays), [count, spanDays]);

  const codeExample = `import { ChatMessageList } from '@mui/x-chat';

<ChatMessageList
  items={messages.map((m) => m.id)}
  autoScroll={true}
  renderItem={({ id }) => <MessageBubble messageId={id} />}
/>`;

  return (
    <PlaygroundCard
      title="ChatMessageList"
      description="Virtualised scroller with auto-scroll, date dividers and an overlay slot."
      previewMinHeight={360}
      span={2}
      codeExample={codeExample}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <NumberControl label="message count" value={count} min={1} max={40} onChange={setCount} />
          <SwitchControl
            label="span multiple days"
            checked={spanDays}
            onChange={setSpanDays}
            helperText="Triggers ChatDateDivider rendering."
          />
          <SwitchControl
            label="autoScroll"
            checked={autoScroll}
            onChange={setAutoScroll}
            helperText="Stick to the bottom on new messages."
          />
          <ChoiceControl<ChatVariant>
            label="variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <ChoiceControl<ChatDensity>
            label="density"
            value={density}
            options={['compact', 'standard', 'comfortable'] as const}
            onChange={setDensity}
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={messages}
          activeConversationId={conversation.id}
        >
          <ChatChrome variant={variant} density={density}>
            <Box
              sx={{
                width: '100%',
                height: 360,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
              }}
            >
              <ChatMessageList
                items={messages.map((m) => m.id)}
                autoScroll={autoScroll}
                renderItem={({ id }) => <MessageBubble key={id} messageId={id} />}
              />
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
