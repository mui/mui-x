import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatMessage as ChatMessageComponent,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';
import {
  useChatStore,
  type ChatConversation,
  type ChatMessage,
  type ChatToolExpand,
  type ChatToolInvocation,
  type ChatToolInvocationState,
} from '@mui/x-chat/headless';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  DividerLabel,
  SelectControl,
  SwitchControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { users } from 'docs/src/modules/components/chat-playground/data';

// The docs compile every demo in one TS project, so the `ChatToolDefinitionMap`
// augmentation from the type-augmentation example is global. Register the `write`
// tool here so its typed input/output line up with that registry.
declare module '@mui/x-chat-headless/types' {
  interface ChatToolDefinitionMap {
    write: {
      input: {
        path: string;
        contents: string;
      };
      output: {
        bytesWritten: number;
        ok: boolean;
      };
    };
  }
}

const conversation: ChatConversation = {
  id: 'tool-expansion-playground',
  title: 'Tool card expansion',
  participants: [users.me, users.assistant],
};

const MESSAGE_ID = 'tool-expansion-demo';

// Builds the `write` tool invocation for a given lifecycle state so stepping the
// `state` control drives a real transition on the same card.
function buildInvocation(state: ChatToolInvocationState): ChatToolInvocation {
  const input = {
    path: 'src/App.tsx',
    contents: 'export const App = () => <div>Hello</div>;\n',
  };
  const base = {
    toolCallId: 'write-call',
    toolName: 'write',
    title: 'write',
  } as const;
  if (state === 'output-available') {
    return { ...base, state, input, output: { bytesWritten: 48, ok: true } };
  }
  if (state === 'output-error') {
    return { ...base, state, input, errorText: 'EACCES: permission denied' };
  }
  return { ...base, state, input };
}

// Stable seed so `ScopedChat` does not remount when the controls change — the
// transitions are driven through the store by `ToolStateEffect` instead.
const SEED_MESSAGE: ChatMessage = {
  id: MESSAGE_ID,
  conversationId: conversation.id,
  role: 'assistant',
  author: users.assistant,
  createdAt: '2026-05-03T09:30:00.000Z',
  status: 'streaming',
  parts: [{ type: 'tool', toolInvocation: buildInvocation('input-streaming') }],
};

type StateOption =
  'input-streaming' | 'input-available' | 'output-available' | 'output-error';
type PresetKey =
  'builtin' | 'collapseWhenDone' | 'openWhileStreaming' | 'alwaysOpen' | 'collapsed';

const PRESETS: Record<
  PresetKey,
  { label: string; code: string; defaultExpanded?: Record<string, ChatToolExpand> }
> = {
  builtin: {
    label: 'Built-in default',
    code: '// no defaultExpanded — the package default is used',
    defaultExpanded: undefined,
  },
  collapseWhenDone: {
    label: 'Expand while running, collapse when done',
    code: `defaultExpanded={{
  write: (ownerState) =>
    ownerState.section
      ? undefined
      : ownerState.state === 'input-streaming' ||
        ownerState.state === 'input-available',
}}`,
    defaultExpanded: {
      write: (ownerState) =>
        ownerState.section
          ? undefined
          : ownerState.state === 'input-streaming' ||
            ownerState.state === 'input-available',
    },
  },
  openWhileStreaming: {
    label: 'Open while the message streams',
    code: `defaultExpanded={{
  write: (ownerState) =>
    ownerState.section ? undefined : ownerState.isMessageStreaming,
}}`,
    defaultExpanded: {
      write: (ownerState) =>
        ownerState.section ? undefined : ownerState.isMessageStreaming,
    },
  },
  alwaysOpen: {
    label: 'Always expanded',
    code: `defaultExpanded={{ write: true }}`,
    defaultExpanded: { write: true },
  },
  collapsed: {
    label: 'Collapsed',
    code: `defaultExpanded={{ write: false }}`,
    defaultExpanded: { write: false },
  },
};

const DEFAULTS = {
  preset: 'collapseWhenDone' as PresetKey,
  state: 'input-available' as StateOption,
  streaming: true,
};

// Syncs the `state`/`streaming` controls into the store on the seeded message so the
// card sees genuine lifecycle transitions (same element identity, no remount).
function ToolStateEffect({
  state,
  streaming,
}: {
  state: StateOption;
  streaming: boolean;
}) {
  const store = useChatStore();
  React.useEffect(() => {
    store.updateMessage(MESSAGE_ID, {
      status: streaming ? 'streaming' : 'sent',
      parts: [{ type: 'tool', toolInvocation: buildInvocation(state) }],
    });
  }, [store, state, streaming]);
  return null;
}

export default function ToolCardExpansionPlayground() {
  const [preset, setPreset] = React.useState<PresetKey>(DEFAULTS.preset);
  const [state, setState] = React.useState<StateOption>(DEFAULTS.state);
  const [streaming, setStreaming] = React.useState(DEFAULTS.streaming);

  const handleReset = React.useCallback(() => {
    setPreset(DEFAULTS.preset);
    setState(DEFAULTS.state);
    setStreaming(DEFAULTS.streaming);
  }, []);

  const { defaultExpanded, code } = PRESETS[preset];

  return (
    <PlaygroundCard
      title="Tool card default expanded state"
      description="Pick a defaultExpanded policy, then step the tool state and toggle message streaming to watch the card expand and collapse."
      previewMinHeight={300}
      span={2}
      onReset={handleReset}
      controls={
        <React.Fragment>
          <DividerLabel>partProps.tool.defaultExpanded</DividerLabel>
          <SelectControl<PresetKey>
            label="policy preset"
            value={preset}
            options={(Object.keys(PRESETS) as PresetKey[]).map((key) => ({
              value: key,
              label: PRESETS[key].label,
            }))}
            onChange={setPreset}
            helperText="Each preset maps to a defaultExpanded entry for the write tool."
          />
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1,
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              borderRadius: 1,
              bgcolor: 'action.hover',
              fontFamily: (theme) =>
                theme.typography.fontFamilyCode ?? 'Menlo, monospace',
            }}
          >
            {code}
          </Box>
          <DividerLabel>fixture (tool lifecycle)</DividerLabel>
          <SelectControl<StateOption>
            label="tool state"
            value={state}
            options={[
              { value: 'input-streaming' },
              { value: 'input-available' },
              { value: 'output-available' },
              { value: 'output-error' },
            ]}
            onChange={setState}
            helperText="Step the lifecycle to drive expand/collapse transitions."
          />
          <SwitchControl
            label="message streaming"
            checked={streaming}
            onChange={setStreaming}
            helperText="Sets message.status, surfaced as ownerState.isMessageStreaming."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[SEED_MESSAGE]}
          activeConversationId={conversation.id}
        >
          <ToolStateEffect state={state} streaming={streaming} />
          <Box sx={{ width: '100%' }}>
            <ChatMessageGroup messageId={MESSAGE_ID}>
              <ChatMessageComponent messageId={MESSAGE_ID}>
                <ChatMessageAvatar />
                <ChatMessageContent partProps={{ tool: { defaultExpanded } }} />
              </ChatMessageComponent>
            </ChatMessageGroup>
          </Box>
        </ScopedChat>
      }
    />
  );
}
