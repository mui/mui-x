import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatBoxLayoutMode, ChatDensity, ChatVariant } from '@mui/x-chat';
import type { SxProps, Theme } from '@mui/material/styles';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import {
  ChoiceControl,
  DividerLabel,
  SwitchControl,
} from '../../_playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from '../../_playground/useCustomizations';
import {
  conversations,
  initialThreads,
  makeAdapter,
  sampleSuggestions,
  users,
} from '../../_playground/data';

const DEFAULTS = {
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
  layoutMode: 'standard' as ChatBoxLayoutMode,
  conversationList: true,
  conversationHeader: true,
  attachments: true,
  suggestions: true,
  scrollToBottom: true,
  helperText: true,
  autoScroll: true,
  suggestionsAutoSubmit: false,
};

type ClassKey = 'root' | 'layout' | 'threadPane' | 'conversationsPane';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
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

function indent(input: string, prefix: string) {
  return input
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : `${prefix}${line}`))
    .join('\n');
}

export default function ChatBoxPlayground() {
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);
  const [layoutMode, setLayoutMode] = React.useState<ChatBoxLayoutMode>(
    DEFAULTS.layoutMode,
  );
  const [conversationList, setConversationList] = React.useState(
    DEFAULTS.conversationList,
  );
  const [conversationHeader, setConversationHeader] = React.useState(
    DEFAULTS.conversationHeader,
  );
  const [attachments, setAttachments] = React.useState(DEFAULTS.attachments);
  const [suggestions, setSuggestions] = React.useState(DEFAULTS.suggestions);
  const [scrollToBottom, setScrollToBottom] = React.useState(
    DEFAULTS.scrollToBottom,
  );
  const [helperText, setHelperText] = React.useState(DEFAULTS.helperText);
  const [autoScroll, setAutoScroll] = React.useState(DEFAULTS.autoScroll);
  const [suggestionsAutoSubmit, setSuggestionsAutoSubmit] = React.useState(
    DEFAULTS.suggestionsAutoSubmit,
  );
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);
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
    setScrollToBottom(DEFAULTS.scrollToBottom);
    setHelperText(DEFAULTS.helperText);
    setAutoScroll(DEFAULTS.autoScroll);
    setSuggestionsAutoSubmit(DEFAULTS.suggestionsAutoSubmit);
  }, []);

  const outerSx = React.useMemo<SxProps<Theme>>(
    () => classesCustomizations.toClassesSx({ height: '100%' }),
    [classesCustomizations],
  );

  const copyCode = React.useCallback(() => {
    const classEntries = (Object.keys(classesCustomizations.values) as ClassKey[])
      .filter((key) => classesCustomizations.values[key].trim())
      .map((key) => {
        const def = CLASS_DEFS.find((d) => d.name === key)!;
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
      conversationList ? '    conversationList: true,' : null,
      conversationHeader ? '    conversationHeader: true,' : null,
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
  initialActiveConversationId={conversations[0].id}
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
    conversationList,
    conversationHeader,
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
          <DividerLabel>features</DividerLabel>
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
          initialActiveConversationId={conversations[0].id}
          variant={variant}
          density={density}
          layoutMode={layoutMode}
          suggestions={sampleSuggestions}
          suggestionsAutoSubmit={suggestionsAutoSubmit}
          features={{
            conversationList,
            conversationHeader,
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
