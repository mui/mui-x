import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatMessageList } from '@mui/x-chat';

import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from '../../_playground/sharedProviders';
import { MessageBubble } from '../../_playground/MessageBubble';
import {
  ChoiceControl,
  NumberControl,
  SwitchControl,
} from '../../_playground/controls';
import { users } from '../../_playground/data';

const conversation = {
  id: 'list-playground',
  title: 'Message list',
  participants: [users.me, users.assistant, users.alice],
};

function buildMessages(messageCount, spanDays) {
  const baseDay = Date.UTC(2026, 4, 3, 9, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  const authorRotation = [users.alice, users.assistant, users.me];
  return Array.from({ length: messageCount }, (_, i) => {
    const author = authorRotation[i % authorRotation.length];
    const role = author === users.assistant ? 'assistant' : 'user';
    const dayOffset = spanDays
      ? Math.floor(i / Math.max(1, Math.ceil(messageCount / 3)))
      : 0;
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
    };
  }).reverse();
}

const DEFAULTS = {
  count: 8,
  spanDays: true,
  autoScroll: true,
  variant: 'default',
  density: 'standard',
};

export default function ChatMessageListPlayground() {
  const [count, setCount] = React.useState(DEFAULTS.count);
  const [spanDays, setSpanDays] = React.useState(DEFAULTS.spanDays);
  const [autoScroll, setAutoScroll] = React.useState(DEFAULTS.autoScroll);
  const [variant, setVariant] = React.useState(DEFAULTS.variant);
  const [density, setDensity] = React.useState(DEFAULTS.density);

  const handleReset = React.useCallback(() => {
    setCount(DEFAULTS.count);
    setSpanDays(DEFAULTS.spanDays);
    setAutoScroll(DEFAULTS.autoScroll);
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
  }, []);

  const messages = React.useMemo(
    () => buildMessages(count, spanDays),
    [count, spanDays],
  );
  return (
    <PlaygroundCard
      title="ChatMessageList"
      description="Virtualised scroller with auto-scroll, date dividers and an overlay slot."
      previewMinHeight={360}
      span={2}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <NumberControl
            label="message count"
            value={count}
            min={1}
            max={40}
            onChange={setCount}
          />
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
          <ChoiceControl
            label="variant"
            value={variant}
            options={['default', 'compact']}
            onChange={setVariant}
          />
          <ChoiceControl
            label="density"
            value={density}
            options={['compact', 'standard', 'comfortable']}
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
