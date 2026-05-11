import * as React from 'react';
import { Box } from '@mui/material';
import {
  ChatComposer,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
  ChatMessageList,
} from '@mui/x-chat';
import type { ChatDensity, ChatVariant } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ChatChrome, ScopedChat } from './sharedProviders';
import { directoryConversations, longThreadMessages } from './sharedFixtures';
import { MessageBubble } from './MessageBubble';
import { ChoiceControl, SwitchControl } from './controls';

const DEFAULTS = {
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
  showHeader: true,
  showComposer: true,
};

export function ChatConversationPlayground() {
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);
  const [showHeader, setShowHeader] = React.useState(DEFAULTS.showHeader);
  const [showComposer, setShowComposer] = React.useState(DEFAULTS.showComposer);

  const handleReset = React.useCallback(() => {
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
    setShowHeader(DEFAULTS.showHeader);
    setShowComposer(DEFAULTS.showComposer);
  }, []);

  const codeExample = `import {
  ChatConversation,
  ChatConversationHeader,
  ChatMessageList,
  ChatComposer,
} from '@mui/x-chat';

<ChatConversation>
  <ChatConversationHeader />
  <ChatMessageList
    items={messages}
    renderItem={({ id }) => <MessageBubble messageId={id} />}
  />
  <ChatComposer />
</ChatConversation>`;

  return (
    <PlaygroundCard
      title="ChatConversation (single thread shell)"
      description="Wrapper that hosts the header, list and composer for one conversation."
      previewMinHeight={420}
      span={2}
      codeExample={codeExample}
      onReset={handleReset}
      controls={
        <React.Fragment>
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
          <SwitchControl label="header" checked={showHeader} onChange={setShowHeader} />
          <SwitchControl label="composer" checked={showComposer} onChange={setShowComposer} />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={directoryConversations}
          messages={longThreadMessages}
          activeConversationId={directoryConversations[0].id}
        >
          <ChatChrome variant={variant} density={density}>
            <Box
              sx={{
                width: '100%',
                height: 420,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
              }}
            >
              <ChatConversation>
                {showHeader ? (
                  <ChatConversationHeader>
                    <ChatConversationHeaderInfo>
                      <ChatConversationTitle />
                      <ChatConversationSubtitle />
                    </ChatConversationHeaderInfo>
                    <ChatConversationHeaderActions />
                  </ChatConversationHeader>
                ) : null}
                <ChatMessageList
                  items={longThreadMessages.map((m) => m.id)}
                  renderItem={({ id }) => <MessageBubble key={id} messageId={id} />}
                />
                {showComposer ? <ChatComposer variant={variant} /> : null}
              </ChatConversation>
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
