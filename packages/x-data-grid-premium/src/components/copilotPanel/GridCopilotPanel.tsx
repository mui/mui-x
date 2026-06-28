'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import type {
  ChatAdapter,
  ChatMessageChunk,
  ChatOnFinish,
  ChatSuggestion,
  ChatStreamEnvelope,
  ChatUser,
  ToolPartSlots,
} from '@mui/x-chat-headless';
import { ChatRoot, useChat } from '@mui/x-chat-headless';
import { CopilotChatPanelContent } from '@mui/x-copilot';
import { createSvgIcon } from '@mui/x-data-grid/internals';
import {
  CopilotPluginRenderProvider,
  type CopilotPlugin,
} from '../../hooks/features/copilot/plugins';
import { CopilotToolBlock } from './CopilotToolBlock';
import { CopilotDataQueryApproval } from './CopilotDataQueryApproval';
import { CopilotMessageMetadata } from './CopilotMessageMetadata';
import { CopilotAbVariantTabs } from './CopilotAbVariantTabs';
import { getGridCopilotLocalStorageAdapterController } from '../../hooks/features/copilot/createGridCopilotLocalStorageAdapter';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridSidebarValue } from '../../hooks/features/sidebar';

type OwnerState = DataGridPremiumProcessedProps;

type HistoryCapableChatAdapter = ChatAdapter &
  Required<Pick<ChatAdapter, 'listConversations' | 'listMessages'>>;

type CopilotIconComponent = ReturnType<typeof createSvgIcon> & {
  propTypes?: Record<string, unknown>;
};

const CopilotChevronLeftIcon = createSvgIcon(
  <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />,
  'CopilotChevronLeft',
) as CopilotIconComponent;

CopilotChevronLeftIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

const CopilotChevronRightIcon = createSvgIcon(
  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />,
  'CopilotChevronRight',
) as CopilotIconComponent;

CopilotChevronRightIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

const CopilotComposeIcon = createSvgIcon(
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z" />,
  'CopilotCompose',
) as CopilotIconComponent;

CopilotComposeIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

const CopilotSubjectIcon = createSvgIcon(
  <path d="M14 17H4v2h10zM20 9H4v2h16zM4 15h16v-2H4zM4 5v2h16V5z" />,
  'CopilotSubject',
) as CopilotIconComponent;

CopilotSubjectIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

const CopilotReturnArrowIcon = createSvgIcon(
  <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z" />,
  'CopilotReturnArrow',
) as CopilotIconComponent;

CopilotReturnArrowIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

const CopilotSettingsIcon = createSvgIcon(
  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6" />,
  'CopilotSettings',
) as CopilotIconComponent;

CopilotSettingsIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

const CopilotFeedbackIcon = createSvgIcon(
  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 12h-2v-2h2zm0-4h-2V6h2z" />,
  'CopilotFeedback',
) as CopilotIconComponent;

CopilotFeedbackIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

const CopilotReportIcon = createSvgIcon(
  <path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27zM12 17.3c-.72 0-1.3-.58-1.3-1.3s.58-1.3 1.3-1.3 1.3.58 1.3 1.3-.58 1.3-1.3 1.3m1-4.3h-2V7h2z" />,
  'CopilotReport',
) as CopilotIconComponent;

CopilotReportIcon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.oneOf(['inherit', 'large', 'medium', 'small']),
  style: PropTypes.object,
  titleAccess: PropTypes.string,
} as any;

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
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  width: '100%',
  overflow: 'hidden',
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

const DEFAULT_SUGGESTIONS: Array<ChatSuggestion | string> = [
  'Summarize this table',
  'Which country has the highest average rating?',
  'Filter to admins only',
];

interface InitialCopilotConversationState {
  activeConversationId?: string;
  draftConversationId?: string;
}

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

function createCopilotConversationId(): string {
  return `mui-x-copilot-${randomId()}`;
}

function getInitialCopilotConversationState(
  supportsPersistentHistory: boolean,
  storedConversationId: string | undefined,
): InitialCopilotConversationState {
  if (!supportsPersistentHistory) {
    return {};
  }

  if (storedConversationId) {
    return { activeConversationId: storedConversationId };
  }

  const draftConversationId = createCopilotConversationId();
  return {
    activeConversationId: draftConversationId,
    draftConversationId,
  };
}

function hasPersistentHistory(adapter: ChatAdapter): adapter is HistoryCapableChatAdapter {
  return (
    typeof adapter.listConversations === 'function' && typeof adapter.listMessages === 'function'
  );
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

// Replaces the chat-headless default author label (which falls back to
// `message.role`, rendering "assistant") with a branded "DataGrid Copilot"
// label for assistant messages. User messages keep whatever label they have.
function mergePluginToolSlots(
  plugins: readonly CopilotPlugin[] | undefined,
): Record<string, Partial<ToolPartSlots>> {
  if (!plugins?.length) {
    return {};
  }
  const merged: Record<string, Partial<ToolPartSlots>> = {};
  for (const plugin of plugins) {
    if (!plugin.toolSlots) {
      continue;
    }
    for (const [toolName, slot] of Object.entries(plugin.toolSlots)) {
      merged[toolName] = slot;
    }
  }
  return merged;
}

const EMPTY_QUERY_RESULTS = new Map() as unknown as ReadonlyMap<string, never>;

/**
 * Re-executes `queryGridData` tool calls from the persisted message list so
 * the in-memory result cache (which plugins consult to resolve `$state`
 * paths) survives a localStorage reload. Renders nothing; subscribes to
 * `useChat().messages` and calls the grid API's hydrate method whenever the
 * messages array changes.
 */
function CopilotQueryResultsHydrator() {
  const apiRef = useGridApiContext();
  const { messages } = useChat();
  React.useEffect(() => {
    apiRef.current.copilot.hydrateQueryResultsFromMessages?.(messages);
  }, [apiRef, messages]);
  return null;
}

function GridCopilotPanel() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  const copilotPlugins = (rootProps as { copilotPlugins?: readonly CopilotPlugin[] })
    .copilotPlugins;
  const pluginToolSlots = React.useMemo(
    () => mergePluginToolSlots(copilotPlugins),
    [copilotPlugins],
  );
  const queryResults = apiRef.current.copilot?.getQueryResults?.() ?? EMPTY_QUERY_RESULTS;
  const pluginRenderContextValue = React.useMemo(
    () => ({ queryResults, apiRef }),
    [queryResults, apiRef],
  );
  // The wrapped adapter tees the response stream so tool-call events apply
  // to the grid via the executor. Falls back to the user-provided adapter
  // (no wrapping), then to the built-in echo adapter for the empty state.
  const wrappedAdapter = apiRef.current.copilot?.getAdapter?.();
  const baseAdapter = wrappedAdapter ?? rootProps.copilotAdapter ?? defaultEchoAdapter;
  const localStorageController = getGridCopilotLocalStorageAdapterController(baseAdapter);
  const supportsPersistentHistory = hasPersistentHistory(baseAdapter);
  const initialConversationStateRef = React.useRef<InitialCopilotConversationState | undefined>(
    undefined,
  );
  if (!initialConversationStateRef.current) {
    initialConversationStateRef.current = getInitialCopilotConversationState(
      supportsPersistentHistory,
      localStorageController?.getInitialActiveConversationId(),
    );
  }
  const initialConversationState = initialConversationStateRef.current;
  const [activeConversationId, setActiveConversationId] = React.useState<string | undefined>(
    () => initialConversationState.activeConversationId,
  );
  const [resetKey, setResetKey] = React.useState(0);
  const activeConversationIdRef = React.useRef(activeConversationId);
  const draftConversationIdRef = React.useRef(initialConversationState.draftConversationId);
  const draftSentRef = React.useRef(!initialConversationState.draftConversationId);
  const baselineGridStateRef = React.useRef<Record<string, unknown> | undefined>(undefined);
  const initialGridStateRestoredRef = React.useRef(false);

  const exportGridState = React.useCallback((): Record<string, unknown> | undefined => {
    try {
      return apiRef.current.exportState() as Record<string, unknown>;
    } catch {
      return undefined;
    }
  }, [apiRef]);

  const captureBaselineGridState = React.useCallback(() => {
    baselineGridStateRef.current ??= exportGridState();
    return baselineGridStateRef.current;
  }, [exportGridState]);

  const restoreGridState = React.useCallback(
    (gridState: Record<string, unknown> | undefined) => {
      if (!gridState) {
        return;
      }

      try {
        apiRef.current.restoreState(gridState as any);
        apiRef.current.showSidebar(GridSidebarValue.Copilot);
      } catch {
        // Stored grid state can become stale as columns/features change.
      }
    },
    [apiRef],
  );

  const restoreConversationGridState = React.useCallback(
    (conversationId: string | undefined) => {
      if (!conversationId || !localStorageController) {
        return;
      }

      restoreGridState(
        localStorageController.getConversationGridState(conversationId) ??
          captureBaselineGridState(),
      );
    },
    [captureBaselineGridState, localStorageController, restoreGridState],
  );

  const persistConversationGridState = React.useCallback(
    (conversationId: string | undefined) => {
      if (!conversationId || !localStorageController) {
        return;
      }

      const gridState = exportGridState();
      if (gridState) {
        localStorageController.persistConversationGridState(conversationId, gridState);
      }
    },
    [exportGridState, localStorageController],
  );

  React.useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  React.useEffect(() => {
    captureBaselineGridState();
  }, [captureBaselineGridState]);

  React.useEffect(() => {
    if (
      !supportsPersistentHistory ||
      !localStorageController ||
      initialGridStateRestoredRef.current
    ) {
      return;
    }

    initialGridStateRestoredRef.current = true;
    captureBaselineGridState();
    restoreConversationGridState(activeConversationIdRef.current);
  }, [
    captureBaselineGridState,
    localStorageController,
    restoreConversationGridState,
    supportsPersistentHistory,
  ]);

  React.useEffect(() => {
    localStorageController?.persistActiveConversationId(activeConversationId);
  }, [activeConversationId, localStorageController]);

  React.useEffect(() => {
    if (!supportsPersistentHistory || !localStorageController) {
      return undefined;
    }

    return apiRef.current.copilot.subscribeResults(() => {
      const conversationId = activeConversationIdRef.current;
      if (
        !conversationId ||
        (conversationId === draftConversationIdRef.current && draftSentRef.current === false)
      ) {
        return;
      }

      persistConversationGridState(conversationId);
    });
  }, [apiRef, localStorageController, persistConversationGridState, supportsPersistentHistory]);

  React.useEffect(() => {
    if (!supportsPersistentHistory) {
      activeConversationIdRef.current = undefined;
      draftConversationIdRef.current = undefined;
      draftSentRef.current = false;
      setActiveConversationId(undefined);
      return;
    }

    setActiveConversationId((currentConversationId) => {
      if (currentConversationId) {
        activeConversationIdRef.current = currentConversationId;
        if (!draftSentRef.current) {
          draftConversationIdRef.current ??= currentConversationId;
        }
        return currentConversationId;
      }

      const nextConversationId = createCopilotConversationId();
      activeConversationIdRef.current = nextConversationId;
      draftConversationIdRef.current = nextConversationId;
      draftSentRef.current = false;
      return nextConversationId;
    });
  }, [supportsPersistentHistory]);

  const createDraftConversation = React.useCallback(() => {
    const nextConversationId = createCopilotConversationId();
    activeConversationIdRef.current = nextConversationId;
    draftConversationIdRef.current = nextConversationId;
    draftSentRef.current = false;
    localStorageController?.persistActiveConversationId(nextConversationId);
    restoreGridState(captureBaselineGridState());
    setActiveConversationId(nextConversationId);
    setResetKey((key) => key + 1);
  }, [captureBaselineGridState, localStorageController, restoreGridState]);

  const handleReload = React.useCallback(() => {
    if (supportsPersistentHistory) {
      createDraftConversation();
      return;
    }

    setResetKey((key) => key + 1);
  }, [createDraftConversation, supportsPersistentHistory]);

  const handleNewConversation = React.useCallback(() => {
    handleReload();
  }, [handleReload]);

  const handleSelectConversation = React.useCallback(
    (conversationId: string) => {
      activeConversationIdRef.current = conversationId;
      setActiveConversationId(conversationId);
      draftConversationIdRef.current = undefined;
      draftSentRef.current = false;
      localStorageController?.persistActiveConversationId(conversationId);
      restoreConversationGridState(conversationId);
    },
    [localStorageController, restoreConversationGridState],
  );

  const handleActiveConversationChange = React.useCallback((nextConversationId?: string) => {
    activeConversationIdRef.current = nextConversationId;
    setActiveConversationId(nextConversationId);

    if (nextConversationId !== draftConversationIdRef.current) {
      draftConversationIdRef.current = undefined;
      draftSentRef.current = false;
    }
  }, []);

  const handleFinish = React.useCallback<ChatOnFinish>(
    ({ message, messages }) => {
      if (!localStorageController) {
        return;
      }

      const conversationId =
        message.conversationId ?? activeConversationIdRef.current ?? draftConversationIdRef.current;
      if (!conversationId) {
        return;
      }

      localStorageController.persistConversationMessages(conversationId, messages);
      persistConversationGridState(conversationId);
    },
    [localStorageController, persistConversationGridState],
  );

  const adapter = React.useMemo<ChatAdapter>(() => {
    if (!supportsPersistentHistory) {
      return baseAdapter;
    }

    return {
      ...baseAdapter,
      async listMessages(input) {
        if (
          input.conversationId === draftConversationIdRef.current &&
          draftSentRef.current === false
        ) {
          return { messages: [], hasMore: false };
        }

        return baseAdapter.listMessages(input);
      },
      async sendMessage(input) {
        const conversationId =
          input.conversationId ??
          activeConversationIdRef.current ??
          draftConversationIdRef.current ??
          createCopilotConversationId();
        activeConversationIdRef.current = conversationId;
        draftConversationIdRef.current ??= conversationId;
        draftSentRef.current = true;

        setActiveConversationId((currentConversationId) =>
          currentConversationId === conversationId ? currentConversationId : conversationId,
        );

        const message = {
          ...input.message,
          conversationId,
        };
        const messages = input.messages.map((candidate) =>
          candidate.id === input.message.id ? message : candidate,
        );

        return baseAdapter.sendMessage({
          ...input,
          conversationId,
          message,
          messages,
        });
      },
    };
  }, [baseAdapter, supportsPersistentHistory]);

  const panelLocaleText = React.useMemo(
    () => ({
      title: apiRef.current.getLocaleText('copilotPanelTitle'),
      beta: apiRef.current.getLocaleText('copilotPanelBeta'),
      menu: apiRef.current.getLocaleText('copilotPanelMenu'),
      back: apiRef.current.getLocaleText('copilotPanelBack'),
      close: apiRef.current.getLocaleText('copilotPanelClose'),
      reload: apiRef.current.getLocaleText('copilotPanelReload'),
      history: apiRef.current.getLocaleText('copilotPanelHistory'),
      session: apiRef.current.getLocaleText('copilotPanelSession'),
      all: apiRef.current.getLocaleText('copilotPanelAll'),
      today: apiRef.current.getLocaleText('copilotPanelToday'),
      yesterday: apiRef.current.getLocaleText('copilotPanelYesterday'),
      viewAll: apiRef.current.getLocaleText('copilotPanelViewAll'),
      ask: apiRef.current.getLocaleText('copilotPanelAsk'),
      moreSuggestions: apiRef.current.getLocaleText('copilotPanelMoreSuggestions'),
      settings: apiRef.current.getLocaleText('copilotPanelSettings'),
      sendFeedback: apiRef.current.getLocaleText('copilotPanelSendFeedback'),
      report: apiRef.current.getLocaleText('copilotPanelReport'),
      emptyStateTitle: apiRef.current.getLocaleText('copilotPanelEmptyStateTitle'),
      emptyStateHelper: apiRef.current.getLocaleText('copilotPanelEmptyStateHelper'),
      emptyConversation: apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation'),
      suggestions: apiRef.current.getLocaleText('aiAssistantSuggestions'),
      promptFieldLabel: apiRef.current.getLocaleText('promptFieldLabel'),
      promptFieldPlaceholder: apiRef.current.getLocaleText('promptFieldPlaceholder'),
      promptFieldSend: apiRef.current.getLocaleText('promptFieldSend'),
    }),
    [apiRef],
  );

  const gridToolSlots = React.useMemo(
    () => ({
      setGridState: { root: CopilotToolBlock },
      runCommands: { root: CopilotToolBlock },
      queryGridData: { root: CopilotDataQueryApproval },
      ...pluginToolSlots,
    }),
    [pluginToolSlots],
  );

  const panelSlots = React.useMemo(
    () => ({
      abVariantTabs: CopilotAbVariantTabs,
      metadataCard: CopilotMessageMetadata,
    }),
    [],
  );

  const handleSwitchVariant = React.useCallback(
    (messageId: string) => {
      apiRef.current.copilot.switchToVariant(messageId);
    },
    [apiRef],
  );

  const handlePanelOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        apiRef.current.hideSidebar();
      }
    },
    [apiRef],
  );

  return (
    <CopilotPanelRoot className={classes.root}>
      <CopilotPluginRenderProvider value={pluginRenderContextValue}>
        <ChatRoot
          key={`${supportsPersistentHistory ? 'history' : 'single'}-${resetKey}`}
          adapter={adapter}
          activeConversationId={supportsPersistentHistory ? activeConversationId : undefined}
          currentUser={COPILOT_CURRENT_USER}
          density="standard"
          variant="compact"
          localeText={{
            composerInputAriaLabel: apiRef.current.getLocaleText('promptFieldLabel'),
            composerInputPlaceholder: apiRef.current.getLocaleText('promptFieldPlaceholder'),
            composerSendButtonLabel: apiRef.current.getLocaleText('promptFieldSend'),
            suggestionsLabel: apiRef.current.getLocaleText('aiAssistantSuggestions'),
          }}
          onActiveConversationChange={
            supportsPersistentHistory ? handleActiveConversationChange : undefined
          }
          onFinish={handleFinish}
          slotProps={{
            root: {
              style: { display: 'contents' },
            },
          }}
        >
          <CopilotQueryResultsHydrator />
          <CopilotChatPanelContent
            open
            onOpenChange={handlePanelOpenChange}
            suggestions={rootProps.copilotSuggestions ?? DEFAULT_SUGGESTIONS}
            localeText={panelLocaleText}
            authorName="DataGrid Copilot"
            toolSlots={gridToolSlots}
            slots={panelSlots}
            onSwitchVariant={handleSwitchVariant}
            onNewConversation={handleNewConversation}
            onSelectConversation={handleSelectConversation}
          />
        </ChatRoot>
      </CopilotPluginRenderProvider>
    </CopilotPanelRoot>
  );
}

export { GridCopilotPanel };
