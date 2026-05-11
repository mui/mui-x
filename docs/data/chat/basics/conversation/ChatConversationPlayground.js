import * as React from 'react';
import Box from '@mui/material/Box';
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

import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from '../../_playground/sharedProviders';
import {
  directoryConversations,
  longThreadMessages,
} from '../../_playground/sharedFixtures';
import { MessageBubble } from '../../_playground/MessageBubble';
import { ChoiceControl, SwitchControl } from '../../_playground/controls';

const DEFAULTS = {
  variant: 'default',
  density: 'standard',
  showHeader: true,
  showComposer: true,
};

export default function ChatConversationPlayground() {
  const [variant, setVariant] = React.useState(DEFAULTS.variant);
  const [density, setDensity] = React.useState(DEFAULTS.density);
  const [showHeader, setShowHeader] = React.useState(DEFAULTS.showHeader);
  const [showComposer, setShowComposer] = React.useState(DEFAULTS.showComposer);

  const handleReset = React.useCallback(() => {
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
    setShowHeader(DEFAULTS.showHeader);
    setShowComposer(DEFAULTS.showComposer);
  }, []);
  return (
    <PlaygroundCard
      title="ChatConversation (single thread shell)"
      description="Wrapper that hosts the header, list and composer for one conversation."
      previewMinHeight={420}
      span={2}
      onReset={handleReset}
      controls={
        <React.Fragment>
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
          <SwitchControl
            label="header"
            checked={showHeader}
            onChange={setShowHeader}
          />
          <SwitchControl
            label="composer"
            checked={showComposer}
            onChange={setShowComposer}
          />
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
