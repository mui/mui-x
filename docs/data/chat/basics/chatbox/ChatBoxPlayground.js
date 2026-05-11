import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import { PlaygroundCard } from '../../_playground/PlaygroundCard';

import { ChoiceControl, SwitchControl } from '../../_playground/controls';
import { parseSx } from '../../_playground/parseSx';
import {
  conversations,
  initialThreads,
  makeAdapter,
  sampleSuggestions,
  users,
} from '../../_playground/data';

const DEFAULTS = {
  variant: 'default',
  density: 'standard',
  layoutMode: 'standard',
  conversationList: true,
  conversationHeader: true,
  attachments: true,
  suggestions: true,
};

const SLOT_DESCRIPTIONS = {
  messageList: 'The scroller wrapping every chat message.',
  messageRoot: 'Each individual message row (assistant or user).',
  messageContent: 'The bubble around each message body.',
  composerRoot: 'The composer surface at the bottom.',
  conversationHeader: 'The bar above the thread.',
};

const CLASS_DESCRIPTIONS = {
  root: 'The outermost ChatBox element.',
  threadPane: 'The active thread column.',
  conversationsPane: 'The sidebar listing conversations.',
};

const CLASS_SELECTORS = {
  root: '.MuiChatBox-root',
  threadPane: '.MuiChatBox-threadPane',
  conversationsPane: '.MuiChatBox-conversationsPane',
};

const SLOT_KEYS = [
  'messageList',
  'messageRoot',
  'messageContent',
  'composerRoot',
  'conversationHeader',
];

const CLASS_KEYS = ['root', 'threadPane', 'conversationsPane'];

function emptyMap(keys) {
  return keys.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {});
}

function indent(input, prefix) {
  return input
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : `${prefix}${line}`))
    .join('\n');
}

export default function ChatBoxPlayground() {
  const [variant, setVariant] = React.useState(DEFAULTS.variant);
  const [density, setDensity] = React.useState(DEFAULTS.density);
  const [layoutMode, setLayoutMode] = React.useState(DEFAULTS.layoutMode);
  const [conversationList, setConversationList] = React.useState(
    DEFAULTS.conversationList,
  );
  const [conversationHeader, setConversationHeader] = React.useState(
    DEFAULTS.conversationHeader,
  );
  const [attachments, setAttachments] = React.useState(DEFAULTS.attachments);
  const [suggestions, setSuggestions] = React.useState(DEFAULTS.suggestions);
  const [slotSx, setSlotSx] = React.useState(() => emptyMap(SLOT_KEYS));
  const [classSx, setClassSx] = React.useState(() => emptyMap(CLASS_KEYS));
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

  const handleSlotsReset = React.useCallback(() => {
    setSlotSx(emptyMap(SLOT_KEYS));
  }, []);

  const handleClassesReset = React.useCallback(() => {
    setClassSx(emptyMap(CLASS_KEYS));
  }, []);

  const slotProps = React.useMemo(() => {
    const result = {};
    SLOT_KEYS.forEach((key) => {
      const parsed = parseSx(slotSx[key]);
      if (parsed.value) {
        result[key] = { sx: parsed.value };
      }
    });
    return result;
  }, [slotSx]);

  const outerSx = React.useMemo(() => {
    const base = { height: '100%' };
    CLASS_KEYS.forEach((key) => {
      if (key === 'root') {
        const parsed = parseSx(classSx[key]);
        if (parsed.value) {
          Object.assign(base, parsed.value);
        }
        return;
      }
      const parsed = parseSx(classSx[key]);
      if (parsed.value) {
        base[`& ${CLASS_SELECTORS[key]}`] = parsed.value;
      }
    });
    return base;
  }, [classSx]);

  const slotCustomizations = React.useMemo(
    () =>
      SLOT_KEYS.map((key) => {
        const parsed = parseSx(slotSx[key]);
        return {
          name: key,
          description: SLOT_DESCRIPTIONS[key],
          sx: slotSx[key],
          parseError: parsed.error,
          onSxChange: (next) => setSlotSx((prev) => ({ ...prev, [key]: next })),
        };
      }),
    [slotSx],
  );

  const classCustomizations = React.useMemo(
    () =>
      CLASS_KEYS.map((key) => {
        const parsed = parseSx(classSx[key]);
        return {
          name: key,
          selector: CLASS_SELECTORS[key],
          description: CLASS_DESCRIPTIONS[key],
          sx: classSx[key],
          parseError: parsed.error,
          onSxChange: (next) => setClassSx((prev) => ({ ...prev, [key]: next })),
        };
      }),
    [classSx],
  );

  const copyCode = React.useCallback(() => {
    const slotPropsEntries = SLOT_KEYS.filter((key) => slotSx[key].trim()).map(
      (key) => `  ${key}: { sx: ${indent(slotSx[key].trim(), '    ')} },`,
    );
    const classEntries = CLASS_KEYS.filter((key) => classSx[key].trim()).map(
      (key) => {
        if (key === 'root') {
          return `  ...${indent(classSx[key].trim(), '  ')}`;
        }
        return `  '& ${CLASS_SELECTORS[key]}': ${indent(classSx[key].trim(), '  ')},`;
      },
    );

    const slotPropsLines =
      slotPropsEntries.length > 0
        ? `\n  slotProps={{\n${slotPropsEntries.map((entry) => `  ${entry}`).join('\n')}\n  }}`
        : '';

    const sxLines =
      classEntries.length > 0
        ? `\n  sx={{\n    height: '100%',\n${classEntries.map((entry) => `  ${entry}`).join('\n')}\n  }}`
        : `\n  sx={{ height: '100%' }}`;

    const featuresLines = [
      conversationList ? '    conversationList: true,' : null,
      conversationHeader ? '    conversationHeader: true,' : null,
      '    scrollToBottom: true,',
      attachments ? '    attachments: true,' : null,
      '    helperText: true,',
      '    autoScroll: true,',
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
  features={{
${featuresLines}
  }}${slotPropsLines}${sxLines}
/>`;
  }, [
    variant,
    density,
    layoutMode,
    conversationList,
    conversationHeader,
    attachments,
    suggestions,
    slotSx,
    classSx,
  ]);

  return (
    <PlaygroundCard
      title="ChatBox"
      description="Full chat surface — conversation list, header, message list, composer, suggestions, and affordances."
      previewFill
      previewMinHeight={520}
      span={3}
      onReset={handleReset}
      slotCustomizations={slotCustomizations}
      classCustomizations={classCustomizations}
      onSlotsReset={handleSlotsReset}
      onClassesReset={handleClassesReset}
      copyCode={copyCode}
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
          <ChoiceControl
            label="layoutMode"
            value={layoutMode}
            options={['standard', 'split', 'overlay']}
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
          slotProps={slotProps}
          sx={outerSx}
        />
      }
    />
  );
}
