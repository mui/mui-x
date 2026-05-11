import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatBoxLayoutMode,
  ChatBoxSlotProps,
  ChatDensity,
  ChatVariant,
} from '@mui/x-chat';
import type { SxProps, Theme } from '@mui/material/styles';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import type { PlaygroundCustomization } from '../../_playground/PlaygroundCard';
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
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
  layoutMode: 'standard' as ChatBoxLayoutMode,
  conversationList: true,
  conversationHeader: true,
  attachments: true,
  suggestions: true,
};

type SlotKey =
  | 'messageList'
  | 'messageRoot'
  | 'messageContent'
  | 'composerRoot'
  | 'conversationHeader';

type ClassKey = 'root' | 'threadPane' | 'conversationsPane';

const SLOT_DESCRIPTIONS: Record<SlotKey, string> = {
  messageList: 'The scroller wrapping every chat message.',
  messageRoot: 'Each individual message row (assistant or user).',
  messageContent: 'The bubble around each message body.',
  composerRoot: 'The composer surface at the bottom.',
  conversationHeader: 'The bar above the thread.',
};

const CLASS_DESCRIPTIONS: Record<ClassKey, string> = {
  root: 'The outermost ChatBox element.',
  threadPane: 'The active thread column.',
  conversationsPane: 'The sidebar listing conversations.',
};

const CLASS_SELECTORS: Record<ClassKey, string> = {
  root: '.MuiChatBox-root',
  threadPane: '.MuiChatBox-threadPane',
  conversationsPane: '.MuiChatBox-conversationsPane',
};

const SLOT_KEYS: readonly SlotKey[] = [
  'messageList',
  'messageRoot',
  'messageContent',
  'composerRoot',
  'conversationHeader',
];

const CLASS_KEYS: readonly ClassKey[] = ['root', 'threadPane', 'conversationsPane'];

function emptyMap<K extends string>(keys: readonly K[]) {
  return keys.reduce(
    (acc, key) => {
      acc[key] = '';
      return acc;
    },
    {} as Record<K, string>,
  );
}

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
  const [slotSx, setSlotSx] = React.useState<Record<SlotKey, string>>(() =>
    emptyMap(SLOT_KEYS),
  );
  const [classSx, setClassSx] = React.useState<Record<ClassKey, string>>(() =>
    emptyMap(CLASS_KEYS),
  );
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

  const slotProps = React.useMemo<ChatBoxSlotProps>(() => {
    const result: Record<string, { sx: Record<string, unknown> }> = {};
    SLOT_KEYS.forEach((key) => {
      const parsed = parseSx(slotSx[key]);
      if (parsed.value) {
        result[key] = { sx: parsed.value };
      }
    });
    return result as ChatBoxSlotProps;
  }, [slotSx]);

  const outerSx = React.useMemo<SxProps<Theme>>(() => {
    const base: Record<string, unknown> = { height: '100%' };
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
    return base as SxProps<Theme>;
  }, [classSx]);

  const slotCustomizations = React.useMemo<PlaygroundCustomization[]>(
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

  const classCustomizations = React.useMemo<PlaygroundCustomization[]>(
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
