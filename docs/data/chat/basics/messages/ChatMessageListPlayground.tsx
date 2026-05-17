import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatMessageList } from '@mui/x-chat';
import type {
  ChatConversation,
  ChatDensity,
  ChatMessage,
  ChatVariant,
} from '@mui/x-chat/headless';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ChatChrome, ScopedChat } from '../../_playground/sharedProviders';
import { MessageBubble } from '../../_playground/MessageBubble';
import {
  ChoiceControl,
  DividerLabel,
  NumberControl,
  SwitchControl,
} from '../../_playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from '../../_playground/useCustomizations';
import { users } from '../../_playground/data';

const conversation: ChatConversation = {
  id: 'list-playground',
  title: 'Message list',
  participants: [users.me, users.assistant, users.alice],
};

function buildMessages(messageCount: number, spanDays: boolean): ChatMessage[] {
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
    } as ChatMessage;
  }).reverse();
}

const DEFAULTS = {
  count: 8,
  spanDays: true,
  autoScroll: true,
  autoScrollBuffer: 150,
  showOverlay: false,
  variant: 'default' as ChatVariant,
  density: 'standard' as ChatDensity,
};

type ClassKey = 'root' | 'scroller' | 'content';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  { name: 'root', description: 'The root list element.' },
  { name: 'scroller', selector: '.MuiChatMessageList-scroller', description: 'Scroller wrapper.' },
  { name: 'content', selector: '.MuiChatMessageList-content', description: 'Inner content area.' },
];

export default function ChatMessageListPlayground() {
  const [count, setCount] = React.useState(DEFAULTS.count);
  const [spanDays, setSpanDays] = React.useState(DEFAULTS.spanDays);
  const [autoScroll, setAutoScroll] = React.useState(DEFAULTS.autoScroll);
  const [autoScrollBuffer, setAutoScrollBuffer] = React.useState(
    DEFAULTS.autoScrollBuffer,
  );
  const [showOverlay, setShowOverlay] = React.useState(DEFAULTS.showOverlay);
  const [variant, setVariant] = React.useState<ChatVariant>(DEFAULTS.variant);
  const [density, setDensity] = React.useState<ChatDensity>(DEFAULTS.density);
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  const handleReset = React.useCallback(() => {
    setCount(DEFAULTS.count);
    setSpanDays(DEFAULTS.spanDays);
    setAutoScroll(DEFAULTS.autoScroll);
    setAutoScrollBuffer(DEFAULTS.autoScrollBuffer);
    setShowOverlay(DEFAULTS.showOverlay);
    setVariant(DEFAULTS.variant);
    setDensity(DEFAULTS.density);
  }, []);

  const messages = React.useMemo(
    () => buildMessages(count, spanDays),
    [count, spanDays],
  );

  let autoScrollValue: boolean | { buffer: number };
  if (!autoScroll) {
    autoScrollValue = false;
  } else if (autoScrollBuffer === DEFAULTS.autoScrollBuffer) {
    autoScrollValue = true;
  } else {
    autoScrollValue = { buffer: autoScrollBuffer };
  }

  const overlay = showOverlay ? (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        inset: theme.spacing(1),
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
      })}
    >
      <Box
        sx={(theme) => ({
          pointerEvents: 'auto',
          padding: theme.spacing(0.5, 1.25),
          borderRadius: 16,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: theme.shadows[1],
        })}
      >
        <Typography variant="caption" color="text.secondary">
          overlay slot
        </Typography>
      </Box>
    </Box>
  ) : null;

  const listSx = classesCustomizations.toClassesSx();
  return (
    <PlaygroundCard
      title="ChatMessageList"
      description="Virtualised scroller with auto-scroll, date dividers and an overlay slot."
      previewMinHeight={360}
      span={2}
      onReset={handleReset}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SwitchControl
            label="autoScroll"
            checked={autoScroll}
            onChange={setAutoScroll}
            helperText="Stick to the bottom on new messages."
          />
          <NumberControl
            label="autoScroll buffer"
            value={autoScrollBuffer}
            min={0}
            max={500}
            step={10}
            disabled={!autoScroll}
            valueFormatter={(value) => `${value}px`}
            helperText="Distance from bottom to still trigger auto-scroll."
            onChange={setAutoScrollBuffer}
          />
          <SwitchControl
            label="overlay"
            checked={showOverlay}
            onChange={setShowOverlay}
            helperText="Demos the `overlay` slot for empty-state UI."
          />
          <DividerLabel>fixture data</DividerLabel>
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
          <DividerLabel>chrome provider</DividerLabel>
          <ChoiceControl<ChatVariant>
            label="ChatChrome.variant"
            value={variant}
            options={['default', 'compact'] as const}
            onChange={setVariant}
          />
          <ChoiceControl<ChatDensity>
            label="ChatChrome.density"
            value={density}
            options={['compact', 'standard', 'comfortable'] as const}
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
                position: 'relative',
              }}
            >
              <ChatMessageList
                items={messages.map((m) => m.id)}
                autoScroll={autoScrollValue}
                overlay={overlay}
                sx={listSx as any}
                renderItem={({ id }) => <MessageBubble key={id} messageId={id} />}
              />
            </Box>
          </ChatChrome>
        </ScopedChat>
      }
    />
  );
}
