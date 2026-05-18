import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';

import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  ChatChrome,
  ScopedChat,
} from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
  SwitchControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation = {
  id: 'group-playground',
  title: 'Grouped messages',
  participants: [users.me, users.assistant],
};

const sampleSnippets = [
  'Three quick notes on theming.',
  'First — the avatar only renders for the first message in a group.',
  'Second — bubbles tighten vertically when grouped.',
  'Third — the meta line stays attached to the last bubble.',
  'Bonus — try toggling the variant on the right.',
];

const DEFAULTS = {
  count: 3,
  author: 'assistant',
  variant: 'default',
  density: 'standard',
  interleave: false,
};

export default function ChatMessageGroupPlayground() {
  const [count, setCount] = React.useState(DEFAULTS.count);
  const [author, setAuthor] = React.useState(DEFAULTS.author);
  const [variant, setVariant] = React.useState(DEFAULTS.variant);
  const [density, setDensity] = React.useState(DEFAULTS.density);
  const [interleave, setInterleave] = React.useState(DEFAULTS.interleave);

  const handleReset = React.useCallback(() => {
    setCount(DEFAULTS.count);
    setAuthor(DEFAULTS.author);
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
    setInterleave(DEFAULTS.interleave);
  }, []);

  const messages = React.useMemo(() => {
    const created = Date.UTC(2026, 4, 3, 10, 0, 0);
    const flippedAuthor = author === 'assistant' ? 'user' : 'assistant';
    return Array.from({ length: count }, (_, i) => {
      const altAuthor = interleave && i % 2 === 1 ? flippedAuthor : author;
      const messageAuthor = altAuthor === 'user' ? users.me : users.assistant;
      return {
        id: `group-msg-${i}`,
        conversationId: conversation.id,
        role: altAuthor,
        author: messageAuthor,
        createdAt: new Date(created + i * 30_000).toISOString(),
        status: 'read',
        parts: [{ type: 'text', text: sampleSnippets[i % sampleSnippets.length] }],
      };
    });
  }, [count, author, interleave]);
  return (
    <PlaygroundCard
      title="ChatMessageGroup"
      description="Wraps consecutive messages from the same author into a visual cluster."
      previewMinHeight={300}
      span={2}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <DividerLabel>fixture data</DividerLabel>
          <NumberControl
            label="message count"
            value={count}
            min={1}
            max={5}
            onChange={setCount}
          />
          <ChoiceControl
            label="author"
            value={author}
            options={['assistant', 'user']}
            onChange={setAuthor}
          />
          <SwitchControl
            label="interleave authors"
            checked={interleave}
            onChange={setInterleave}
            helperText="Alternate authors so groups break."
          />
          <DividerLabel>chrome provider</DividerLabel>
          <ChoiceControl
            label="ChatChrome.variant"
            value={variant}
            options={['default', 'compact']}
            onChange={setVariant}
          />
          <ChoiceControl
            label="ChatChrome.density"
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
            <Box sx={{ width: '100%' }}>
              {messages.map((message) => (
                <ChatMessageGroup key={message.id} messageId={message.id}>
                  <ChatMessageComponent messageId={message.id}>
                    <ChatMessageAvatar />
                    <ChatMessageContent />
                  </ChatMessageComponent>
                </ChatMessageGroup>
              ))}
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
