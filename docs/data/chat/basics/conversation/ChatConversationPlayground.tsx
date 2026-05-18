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
import type { ChatDensity, ChatVariant } from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  ChatChrome,
  ScopedChat,
} from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  directoryConversations,
  longThreadMessages,
} from 'docs/src/modules/components/chat-playground/sharedFixtures';
import { MessageBubble } from 'docs/src/modules/components/chat-playground/MessageBubble';
import {
  ChoiceControl,
  DividerLabel,
  SwitchControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';

const DEFAULTS = {
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
  showHeader: true,
  showComposer: true,
};

type ClassKey = 'root';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The outermost element of ChatConversation.' },
];

export default function ChatConversationPlayground() {
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);
  const [showHeader, setShowHeader] = React.useState(DEFAULTS.showHeader);
  const [showComposer, setShowComposer] = React.useState(DEFAULTS.showComposer);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const handleReset = React.useCallback(() => {
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
    setShowHeader(DEFAULTS.showHeader);
    setShowComposer(DEFAULTS.showComposer);
  }, []);

  const conversationSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatConversation (single thread shell)"
      description="Wrapper that hosts the header, list and composer for one conversation."
      previewMinHeight={420}
      span={2}
      onReset={handleReset}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>Chrome provider</DividerLabel>
          <ChoiceControl<ChatVariant>
            label="ChatChrome.variant"
            helperText="Set on the ChatVariantProvider — not on ChatConversation."
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <ChoiceControl<ChatDensity>
            label="ChatChrome.density"
            value={density}
            helperText="Set on the ChatDensityProvider — not on ChatConversation."
            options={['compact', 'standard', 'comfortable'] as const}
            onChange={setDensity}
          />
          <DividerLabel>Composition</DividerLabel>
          <SwitchControl
            label="render header"
            helperText="Render <ChatConversationHeader> as a child."
            checked={showHeader}
            onChange={setShowHeader}
          />
          <SwitchControl
            label="render composer"
            helperText="Render <ChatComposer> as a child."
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
              <ChatConversation sx={conversationSx as any}>
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
