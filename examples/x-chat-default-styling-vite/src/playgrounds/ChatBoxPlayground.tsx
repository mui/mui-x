import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatBoxLayoutMode, ChatDensity, ChatVariant } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { ChoiceControl, SwitchControl } from './controls';
import { conversations, initialThreads, makeAdapter, sampleSuggestions, users } from '../data';

const DEFAULTS = {
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
  layoutMode: 'standard' as ChatBoxLayoutMode,
  conversationList: true,
  conversationHeader: true,
  attachments: true,
  suggestions: true,
};

export function ChatBoxPlayground() {
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);
  const [layoutMode, setLayoutMode] = React.useState<ChatBoxLayoutMode>(DEFAULTS.layoutMode);
  const [conversationList, setConversationList] = React.useState(DEFAULTS.conversationList);
  const [conversationHeader, setConversationHeader] = React.useState(DEFAULTS.conversationHeader);
  const [attachments, setAttachments] = React.useState(DEFAULTS.attachments);
  const [suggestions, setSuggestions] = React.useState(DEFAULTS.suggestions);
  const threadMapRef = React.useRef(initialThreads);
  const adapter = React.useMemo(() => makeAdapter(threadMapRef.current), []);

  const handleReset = React.useCallback(() => {
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
    setLayoutMode(DEFAULTS.layoutMode);
    setConversationList(DEFAULTS.conversationList);
    setConversationHeader(DEFAULTS.conversationHeader);
    setAttachments(DEFAULTS.attachments);
    setSuggestions(DEFAULTS.suggestions);
  }, []);

  const codeExample = `import { ChatBox } from '@mui/x-chat';

<ChatBox
  adapter={adapter}
  initialConversations={conversations}
  initialActiveConversationId="styling-questions"
  suggestions={sampleSuggestions}
  sx={{ height: 560 }}
/>;
`;

  return (
    <PlaygroundCard
      title="ChatBox"
      description="Full chat surface — conversation list, header, message list, composer, suggestions, and affordances."
      previewFill
      previewBackground="background.default"
      previewMinHeight={520}
      span={3}
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
          <ChoiceControl<ChatBoxLayoutMode>
            label="layoutMode"
            value={layoutMode}
            options={['standard', 'split', 'overlay'] as const}
            onChange={setLayoutMode}
          />
          <SwitchControl
            label="conversationList"
            checked={conversationList}
            onChange={setConversationList}
          />
          <SwitchControl
            label="conversationHeader"
            checked={conversationHeader}
            onChange={setConversationHeader}
          />
          <SwitchControl label="attachments" checked={attachments} onChange={setAttachments} />
          <SwitchControl label="suggestions" checked={suggestions} onChange={setSuggestions} />
        </React.Fragment>
      }
      preview={
        <ChatBox
          adapter={adapter}
          currentUser={users.me}
          members={[users.me, users.assistant, users.alice]}
          initialConversations={conversations}
          initialActiveConversationId={conversations[0].id}
          variant={variant}
          density={density}
          layoutMode={layoutMode}
          suggestions={sampleSuggestions}
          features={{
            conversationList,
            conversationHeader,
            scrollToBottom: true,
            attachments,
            helperText: true,
            autoScroll: true,
            suggestions,
          }}
          sx={{ height: '100%' }}
        />
      }
    />
  );
}
