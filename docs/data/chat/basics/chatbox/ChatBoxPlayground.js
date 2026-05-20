import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  ChoiceControl,
  DividerLabel,
  SwitchControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import {
  conversations,
  initialThreads,
  makeAdapter,
  sampleSuggestions,
  users,
} from 'docs/src/modules/components/chat-playground/data';

const DEFAULTS = {
  variant: 'default',
  density: 'standard',
  layoutMode: 'standard',
  conversationList: true,
  conversationHeader: true,
  attachments: true,
  suggestions: true,
  scrollToBottom: true,
  helperText: true,
  autoScroll: true,
  suggestionsAutoSubmit: false,
};

const CLASS_DEFS = [
  { name: 'root', description: 'The outermost ChatBox element.' },
  {
    name: 'layout',
    selector: '.MuiChatBox-layout',
    description: 'The pane layout container.',
  },
  {
    name: 'threadPane',
    selector: '.MuiChatBox-threadPane',
    description: 'The active thread column.',
  },
  {
    name: 'conversationsPane',
    selector: '.MuiChatBox-conversationsPane',
    description: 'The sidebar listing conversations.',
  },
];

function indent(input, prefix) {
  return input
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : `${prefix}${line}`))
    .join('\n');
}

export default function ChatBoxPlayground(props = {}) {
  const { hideHeader, defaults: defaultsOverride } = props;
  const defaults = React.useMemo(
    () => ({ ...DEFAULTS, ...defaultsOverride }),
    [defaultsOverride],
  );
  const [variant, setVariant] = React.useState(defaults.variant);
  const [density, setDensity] = React.useState(defaults.density);
  const [layoutMode, setLayoutMode] = React.useState(defaults.layoutMode);
  const [conversationList, setConversationList] = React.useState(
    defaults.conversationList,
  );
  const [conversationHeader, setConversationHeader] = React.useState(
    defaults.conversationHeader,
  );
  const [attachments, setAttachments] = React.useState(defaults.attachments);
  const [suggestions, setSuggestions] = React.useState(defaults.suggestions);
  const [scrollToBottom, setScrollToBottom] = React.useState(
    defaults.scrollToBottom,
  );
  const [helperText, setHelperText] = React.useState(defaults.helperText);
  const [autoScroll, setAutoScroll] = React.useState(defaults.autoScroll);
  const [suggestionsAutoSubmit, setSuggestionsAutoSubmit] = React.useState(
    defaults.suggestionsAutoSubmit,
  );
  const [activeConversationId, setActiveConversationId] = React.useState(
    conversations[0].id,
  );
  const classesCustomizations = useCustomizations(CLASS_DEFS);
  const threadMapRef = React.useRef(initialThreads);
  const adapter = React.useMemo(() => makeAdapter(threadMapRef.current), []);

  const handleReset = React.useCallback(() => {
    setVariant(defaults.variant);
    setDensity(defaults.density);
    setLayoutMode(defaults.layoutMode);
    setConversationList(defaults.conversationList);
    setConversationHeader(defaults.conversationHeader);
    setAttachments(defaults.attachments);
    setSuggestions(defaults.suggestions);
    setScrollToBottom(defaults.scrollToBottom);
    setHelperText(defaults.helperText);
    setAutoScroll(defaults.autoScroll);
    setSuggestionsAutoSubmit(defaults.suggestionsAutoSubmit);
    setActiveConversationId(conversations[0].id);
  }, [defaults]);

  const outerSx = React.useMemo(
    () => classesCustomizations.toClassesSx({ height: '100%' }),
    [classesCustomizations],
  );

  // split / overlay layouts only make sense alongside the conversation list and
  // its header, so force them on (and lock the toggles) for those modes.
  const layoutRequiresConversation =
    layoutMode === 'split' || layoutMode === 'overlay';
  const effectiveConversationList = layoutRequiresConversation || conversationList;
  const effectiveConversationHeader =
    layoutRequiresConversation || conversationHeader;
  const layoutLockHint = layoutRequiresConversation
    ? `Required by layoutMode="${layoutMode}".`
    : undefined;

  // Without the conversation list there's no UI to pick a conversation, so
  // restore the first one whenever the user lands in that state (e.g. after
  // a back-click in split mode cleared the selection).
  React.useEffect(() => {
    if (!effectiveConversationList && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [effectiveConversationList, activeConversationId]);

  const copyCode = React.useCallback(() => {
    const classEntries = Object.keys(classesCustomizations.values)
      .filter((key) => classesCustomizations.values[key].trim())
      .map((key) => {
        const def = CLASS_DEFS.find((d) => d.name === key);
        if (key === 'root') {
          return `    ...${indent(classesCustomizations.values[key].trim(), '    ')}`;
        }
        return `    '& ${def.selector}': ${indent(classesCustomizations.values[key].trim(), '    ')},`;
      });

    const sxLines =
      classEntries.length > 0
        ? `\n  sx={{\n    height: '100%',\n${classEntries.join('\n')}\n  }}`
        : `\n  sx={{ height: '100%' }}`;

    const featuresLines = [
      effectiveConversationList ? '    conversationList: true,' : null,
      effectiveConversationHeader ? '    conversationHeader: true,' : null,
      scrollToBottom ? '    scrollToBottom: true,' : '    scrollToBottom: false,',
      attachments ? '    attachments: true,' : null,
      helperText ? '    helperText: true,' : '    helperText: false,',
      autoScroll ? '    autoScroll: true,' : '    autoScroll: false,',
      suggestions ? '    suggestions: true,' : null,
    ]
      .filter(Boolean)
      .join('\n');

    return `<ChatBox
  adapter={adapter}
  currentUser={currentUser}
  members={members}
  initialConversations={conversations}
  activeConversationId={activeConversationId}
  onActiveConversationChange={setActiveConversationId}
  variant="${variant}"
  density="${density}"
  layoutMode="${layoutMode}"
  suggestions={sampleSuggestions}
  suggestionsAutoSubmit={${suggestionsAutoSubmit}}
  features={{
${featuresLines}
  }}${sxLines}
/>`;
  }, [
    variant,
    density,
    layoutMode,
    effectiveConversationList,
    effectiveConversationHeader,
    attachments,
    suggestions,
    scrollToBottom,
    helperText,
    autoScroll,
    suggestionsAutoSubmit,
    classesCustomizations.values,
  ]);

  return (
    <PlaygroundCard
      title="ChatBox"
      description="Full chat surface — conversation list, header, message list, composer, suggestions, and affordances."
      hideHeader={hideHeader}
      previewFill
      previewMinHeight={520}
      span={3}
      onReset={handleReset}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      copyCode={copyCode}
      controls={
        <React.Fragment>
          <DividerLabel>Appearance</DividerLabel>
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
          <ChoiceControl
            label="layoutMode"
            value={layoutMode}
            options={['standard', 'split', 'overlay']}
            onChange={setLayoutMode}
          />
          <DividerLabel>features</DividerLabel>
          <SwitchControl
            label="conversationList"
            checked={effectiveConversationList}
            onChange={setConversationList}
            disabled={layoutRequiresConversation}
            helperText={layoutLockHint}
          />
          <SwitchControl
            label="conversationHeader"
            checked={effectiveConversationHeader}
            onChange={setConversationHeader}
            disabled={layoutRequiresConversation}
            helperText={layoutLockHint}
          />
          <SwitchControl
            label="attachments"
            checked={attachments}
            onChange={setAttachments}
          />
          <SwitchControl
            label="suggestions"
            checked={suggestions}
            onChange={setSuggestions}
          />
          <SwitchControl
            label="scrollToBottom"
            checked={scrollToBottom}
            onChange={setScrollToBottom}
            helperText="Floating jump-to-latest affordance."
          />
          <SwitchControl
            label="helperText"
            checked={helperText}
            onChange={setHelperText}
            helperText="Hint row below the composer."
          />
          <SwitchControl
            label="autoScroll"
            checked={autoScroll}
            onChange={setAutoScroll}
            helperText="Stick to the bottom on new messages."
          />
          <DividerLabel>Suggestions</DividerLabel>
          <SwitchControl
            label="suggestionsAutoSubmit"
            checked={suggestionsAutoSubmit}
            onChange={setSuggestionsAutoSubmit}
            helperText="Submit on click instead of populating the input."
          />
        </React.Fragment>
      }
      preview={
        <ChatBox
          adapter={adapter}
          currentUser={users.me}
          members={[users.me, users.assistant, users.alice]}
          initialConversations={conversations}
          activeConversationId={activeConversationId}
          onActiveConversationChange={setActiveConversationId}
          variant={variant}
          density={density}
          layoutMode={layoutMode}
          suggestions={sampleSuggestions}
          suggestionsAutoSubmit={suggestionsAutoSubmit}
          features={{
            conversationList: effectiveConversationList,
            conversationHeader: effectiveConversationHeader,
            scrollToBottom,
            attachments,
            helperText,
            autoScroll,
            suggestions,
          }}
          sx={outerSx}
        />
      }
    />
  );
}
