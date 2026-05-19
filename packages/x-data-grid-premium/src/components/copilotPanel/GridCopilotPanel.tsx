'use client';
import * as React from 'react';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatMessageChunk,
  ChatStreamEnvelope,
  ChatUser,
} from '@mui/x-chat-headless';
import { CopilotToolBlock } from './CopilotToolBlock';
import { CopilotMessageMetadata } from './CopilotMessageMetadata';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['copilotPanel'],
    header: ['copilotPanelHeader'],
    title: ['copilotPanelTitle'],
    titleGroup: ['copilotPanelTitleGroup'],
    beta: ['copilotPanelBeta'],
    body: ['copilotPanelBody'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const CopilotPanelRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanel',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  width: '100%',
  overflow: 'hidden',
});

const CopilotPanelHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelHeader',
})<{ ownerState: OwnerState }>({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${vars.colors.border.base}`,
  height: 52,
  padding: vars.spacing(0, 0.75, 0, 1.5),
});

const CopilotPanelTitleGroup = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelTitleGroup',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.75),
  minWidth: 0,
});

const CopilotPanelTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelTitle',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
});

const CopilotPanelBeta = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelBeta',
})<{ ownerState: OwnerState }>({
  display: 'inline-flex',
  alignItems: 'center',
  height: 20,
  padding: vars.spacing(0, 0.75),
  borderRadius: vars.radius.base,
  font: vars.typography.font.small,
  fontWeight: vars.typography.fontWeight.medium,
  letterSpacing: 0.4,
  color: vars.colors.foreground.accent,
  background: vars.colors.background.base,
});

const CopilotPanelBody = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelBody',
})<{ ownerState: OwnerState }>({
  flex: 1,
  minHeight: 0,
  display: 'flex',
});

const ECHO_DELAY_MS = 60;

const COPILOT_AGENT: ChatUser = {
  id: 'mui-x-copilot',
  displayName: 'DataGrid Copilot',
  role: 'assistant',
};

const COPILOT_CURRENT_USER: ChatUser = {
  id: 'you',
  displayName: 'You',
  role: 'user',
};

const DEFAULT_SUGGESTIONS = [
  'Summarize this table',
  'Which country has the highest average rating?',
  'Filter to admins only',
];

function splitText(text: string, size = 18): string[] {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks.length === 0 ? [''] : chunks;
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEchoStream(text: string): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  const messageId = randomId();
  const partId = `${messageId}-text`;
  const chunks: ChatMessageChunk[] = [
    { type: 'start', messageId, author: COPILOT_AGENT },
    { type: 'text-start', id: partId },
    ...splitText(text).map(
      (delta) => ({ type: 'text-delta', id: partId, delta }) satisfies ChatMessageChunk,
    ),
    { type: 'text-end', id: partId },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];

  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    start(controller) {
      chunks.forEach((chunk, index) => {
        setTimeout(
          () => {
            controller.enqueue(chunk);
            if (index === chunks.length - 1) {
              controller.close();
            }
          },
          ECHO_DELAY_MS * (index + 1),
        );
      });
    },
  });
}

const defaultEchoAdapter: ChatAdapter = {
  async sendMessage({ message }) {
    const userText = message.parts
      .map((part) => (part.type === 'text' ? part.text : null))
      .filter(Boolean)
      .join('\n');
    return createEchoStream(`Echo: ${userText || '(empty message)'}`);
  },
};

function GridCopilotPanel() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  // The wrapped adapter tees the response stream so tool-call events apply
  // to the grid via the executor. Falls back to the user-provided adapter
  // (no wrapping), then to the built-in echo adapter for the empty state.
  const wrappedAdapter = apiRef.current.copilot?.getAdapter?.();
  const adapter = wrappedAdapter ?? rootProps.copilotAdapter ?? defaultEchoAdapter;
  const [resetKey, setResetKey] = React.useState(0);

  const handleReload = React.useCallback(() => {
    setResetKey((key) => key + 1);
  }, []);

  return (
    <CopilotPanelRoot className={classes.root} ownerState={rootProps}>
      <CopilotPanelHeader className={classes.header} ownerState={rootProps}>
        <CopilotPanelTitleGroup className={classes.titleGroup} ownerState={rootProps}>
          <rootProps.slots.copilotIcon fontSize="small" />
          <CopilotPanelTitle className={classes.title} ownerState={rootProps}>
            {apiRef.current.getLocaleText('copilotPanelTitle')}
          </CopilotPanelTitle>
          <CopilotPanelBeta className={classes.beta} ownerState={rootProps}>
            {apiRef.current.getLocaleText('copilotPanelBeta')}
          </CopilotPanelBeta>
        </CopilotPanelTitleGroup>
        <rootProps.slots.baseIconButton
          {...rootProps.slotProps?.baseIconButton}
          aria-label={apiRef.current.getLocaleText('copilotPanelReload')}
          onClick={handleReload}
        >
          <rootProps.slots.promptRerunIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
        <rootProps.slots.baseIconButton
          {...rootProps.slotProps?.baseIconButton}
          aria-label={apiRef.current.getLocaleText('copilotPanelClose')}
          onClick={() => apiRef.current.hideSidebar()}
        >
          <rootProps.slots.copilotPanelCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </CopilotPanelHeader>
      <CopilotPanelBody className={classes.body} ownerState={rootProps}>
        <ChatBox
          key={resetKey}
          adapter={adapter}
          variant="compact"
          currentUser={COPILOT_CURRENT_USER}
          features={{
            conversationHeader: false,
            attachments: false,
            scrollToBottom: true,
            autoScroll: true,
          }}
          suggestions={rootProps.copilotSuggestions ?? DEFAULT_SUGGESTIONS}
          suggestionsAutoSubmit
          sx={{
            flex: 1,
            minHeight: 0,
            '--MuiChatMessage-avatarSize': '0px',
            '& .MuiChatMessage-root': {
              gridTemplateColumns: '0 1fr auto',
            },
            '& .MuiChatMessage-avatar': { display: 'none' },
          }}
          slotProps={{
            messageContent: {
              afterContent: <CopilotMessageMetadata />,
              partProps: {
                tool: {
                  toolSlots: {
                    setGridState: { root: CopilotToolBlock },
                    runCommands: { root: CopilotToolBlock },
                  },
                },
              },
            },
          }}
        />
      </CopilotPanelBody>
    </CopilotPanelRoot>
  );
}

export { GridCopilotPanel };
