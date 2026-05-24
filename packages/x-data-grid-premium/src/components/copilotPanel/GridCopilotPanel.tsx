'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';
import {
  ChatComposer,
  ChatMessage,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageList,
  ChatMessageMeta,
  ChatScrollToBottomAffordance,
  ChatSuggestions,
} from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatMessageChunk,
  ChatOnFinish,
  ChatSuggestion,
  ChatStreamEnvelope,
  ChatUser,
  ToolPartSlots,
} from '@mui/x-chat-headless';
import { ChatRoot, useChat, useChatComposer, useMessageIds } from '@mui/x-chat-headless';
import { GridMenuIcon } from '@mui/x-data-grid';
import { createSvgIcon } from '@mui/x-data-grid/internals';
import {
  CopilotPluginRenderProvider,
  type CopilotPlugin,
} from '../../hooks/features/copilot/plugins';
import { CopilotToolBlock } from './CopilotToolBlock';
import { CopilotDataQueryApproval } from './CopilotDataQueryApproval';
import { CopilotMessageMetadata } from './CopilotMessageMetadata';
import { CopilotMessageFooter } from './CopilotMessageFooter';
import { CopilotStreamingIndicator } from './CopilotStreamingIndicator';
import { CopilotTurnSpacer } from './CopilotTurnSpacer';
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

const CopilotPanelHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelHeader',
})({
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
})({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.75),
  minWidth: 0,
});

const CopilotPanelTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelTitle',
})({
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
});

const CopilotPanelBeta = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelBeta',
})({
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
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
});

const CopilotThreadRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelThread',
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '--MuiChatMessage-avatarSize': '0px',
  '& .MuiChatMessage-root': {
    gridTemplateColumns: '0 1fr auto',
    paddingInline: vars.spacing(2),
  },
  '& .MuiChatMessage-avatar': {
    display: 'none',
  },
  '& .MuiChatMessage-content': {
    maxWidth: '100%',
  },
  '& .MuiChatMessage-bubble': {
    padding: '0 !important',
    width: '100%',
  },
  '& .MuiChatMessage-roleUser .MuiChatMessage-content': {
    alignItems: 'flex-end',
  },
  '& .MuiChatMessage-roleUser .MuiChatMessage-bubble': {
    width: 'auto',
    maxWidth: '78%',
    padding: vars.spacing(1.25, 1.5),
    borderRadius: vars.radius.base,
    backgroundColor: vars.colors.background.base,
    color: vars.colors.foreground.base,
  },
});

const CopilotThreadBody = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelThreadBody',
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

const CopilotEmptyThread = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyThread',
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: vars.spacing(4, 2, 2),
});

const CopilotEmptyHero = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyHero',
})({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.spacing(1),
  textAlign: 'center',
  minHeight: 180,
});

const CopilotEmptyHeroTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyHeroTitle',
})({
  maxWidth: 360,
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.colors.foreground.accent,
});

const CopilotEmptyHeroHelper = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelEmptyHeroHelper',
})({
  maxWidth: 360,
  font: vars.typography.font.body,
  color: vars.colors.foreground.muted,
});

const CopilotComposerShell = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelComposerShell',
})({
  flexShrink: 0,
  padding: vars.spacing(1, 1.5, 1.5),
});

const CopilotDisclaimer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelDisclaimer',
})({
  textAlign: 'center',
  marginTop: vars.spacing(1),
  padding: vars.spacing(0, 0.5),
  font: vars.typography.font.small,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.colors.foreground.muted,
  fontSize: '8pt',
});

const PostTurnSuggestionsShell = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelPostTurnSuggestions',
})({
  marginBottom: vars.spacing(0.75),
});

const CopilotMenuRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenu',
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: vars.colors.background.base,
});

const CopilotMenuHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuHeader',
})({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  minHeight: 52,
  padding: vars.spacing(0, 0.75),
});

const CopilotMenuHeaderSpacer = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuHeaderSpacer',
})({
  flex: 1,
});

const CopilotMenuHeaderTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuHeaderTitle',
})({
  flex: 1,
  minWidth: 0,
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.colors.foreground.base,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingInlineStart: vars.spacing(0.5),
});

const CopilotListGroupHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelListGroupHeader',
})({
  padding: vars.spacing(1.5, 1.25, 0.5),
  font: vars.typography.font.body,
  color: vars.colors.foreground.muted,
});

const CopilotMenuContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuContent',
})({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: vars.spacing(0.5, 1, 2),
});

const CopilotMenuSection = styled('section', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuSection',
})({
  padding: vars.spacing(1, 0),
  borderBottom: `1px solid ${vars.colors.border.base}`,
  '&:last-of-type': {
    borderBottom: 0,
  },
});

const CopilotMenuSectionHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuSectionHeader',
})({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing(1),
  padding: vars.spacing(0, 1.25),
  marginBottom: vars.spacing(0.5),
});

const CopilotMenuSectionTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuSectionTitle',
})({
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.colors.foreground.base,
});

const CopilotMenuSectionAction = styled('button', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuSectionAction',
})({
  border: 0,
  padding: vars.spacing(0.25, 0.5),
  borderRadius: vars.radius.base,
  background: 'transparent',
  font: vars.typography.font.body,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.colors.foreground.muted,
  cursor: 'pointer',
  '&:hover': {
    color: vars.colors.foreground.accent,
    background: `color-mix(in srgb, ${vars.colors.interactive.hover} calc(${vars.colors.interactive.hoverOpacity} * 100%), transparent)`,
  },
  '&:focus-visible': {
    outline: `2px solid ${vars.colors.interactive.focus}`,
    outlineOffset: 2,
  },
});

const CopilotMenuList = styled(MenuList, {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuList',
})({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  '& .MuiMenuItem-root': {
    borderRadius: vars.radius.base,
    minHeight: 40,
    paddingBlock: vars.spacing(0.5),
    paddingInline: vars.spacing(1.25),
    gap: vars.spacing(1),
  },
  '& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root[aria-current="true"]': {
    background: `color-mix(in srgb, ${vars.colors.interactive.hover} calc(${vars.colors.interactive.hoverOpacity} * 100%), transparent)`,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    color: vars.colors.foreground.muted,
  },
  '& .MuiListItemText-root': {
    margin: 0,
  },
  '& .MuiListItemText-primary': {
    font: vars.typography.font.body,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .MuiListItemText-secondary': {
    font: vars.typography.font.body,
    color: vars.colors.foreground.muted,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const CopilotMenuRowTrailing = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuRowTrailing',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.spacing(1),
  color: vars.colors.foreground.muted,
});

const CopilotMenuBadge = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelMenuBadge',
})({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 36,
  height: 20,
  padding: vars.spacing(0, 0.75),
  borderRadius: 999,
  font: vars.typography.font.small,
  fontWeight: vars.typography.fontWeight.medium,
  color: '#fff',
  background: vars.colors.interactive.focus,
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

function getSuggestionValue(suggestion: ChatSuggestion | string): string {
  return typeof suggestion === 'string' ? suggestion : suggestion.value;
}

function getSuggestionLabel(suggestion: ChatSuggestion | string): string {
  return typeof suggestion === 'string' ? suggestion : (suggestion.label ?? suggestion.value);
}

function formatConversationDate(
  value: string | number | Date | undefined | null,
  todayLabel: string,
  yesterdayLabel: string,
): string | undefined {
  if (value == null) {
    return undefined;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  const now = new Date();
  const startOfDay = (input: Date) =>
    new Date(input.getFullYear(), input.getMonth(), input.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (diffDays <= 0) {
    return todayLabel;
  }
  if (diffDays === 1) {
    return yesterdayLabel;
  }
  return date.toLocaleDateString();
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
const CopilotAuthorName = styled('div', {
  name: 'MuiChatMessage',
  slot: 'GroupAuthorName',
  shouldForwardProp: (prop) =>
    prop !== 'authorRole' &&
    prop !== 'variant' &&
    prop !== 'ownerState' &&
    prop !== 'theme' &&
    prop !== 'sx' &&
    prop !== 'as',
})<{ authorRole?: string; variant?: string }>(({ theme, authorRole, variant }) => {
  const isCompact = variant === 'compact';
  const isUser = authorRole === 'user';
  const avatarOffset = `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`;
  return {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: isCompact
      ? (theme.vars || theme).palette.primary.main
      : (theme.vars || theme).palette.text.secondary,
    ...(isCompact && {
      gridArea: 'authorName',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(1),
      lineHeight: 1,
    }),
    ...(!isCompact && isUser && { textAlign: 'right' as const, paddingInlineEnd: avatarOffset }),
    ...(!isCompact && !isUser && { paddingInlineStart: avatarOffset }),
  };
});

function CopilotAuthorNameSlot(props: {
  ownerState?: { authorRole?: string; variant?: string };
  children?: React.ReactNode;
}) {
  const { ownerState, children, ...rest } = props;
  const label = ownerState?.authorRole === 'assistant' ? 'DataGrid Copilot' : children;
  return (
    <CopilotAuthorName authorRole={ownerState?.authorRole} variant={ownerState?.variant} {...rest}>
      {label}
    </CopilotAuthorName>
  );
}

function CopilotMessageItem({
  id,
  pluginToolSlots,
}: {
  id: string;
  pluginToolSlots: Record<string, Partial<ToolPartSlots>>;
}) {
  const toolSlots = React.useMemo(
    () => ({
      setGridState: { root: CopilotToolBlock },
      runCommands: { root: CopilotToolBlock },
      queryGridData: { root: CopilotDataQueryApproval },
      ...pluginToolSlots,
    }),
    [pluginToolSlots],
  );
  return (
    <ChatMessageGroup messageId={id} slots={{ authorName: CopilotAuthorNameSlot }}>
      <ChatMessage messageId={id}>
        <ChatMessageContent
          afterContent={
            <React.Fragment>
              <CopilotStreamingIndicator />
              <CopilotMessageMetadata />
              <CopilotMessageFooter />
            </React.Fragment>
          }
          partProps={{
            tool: {
              toolSlots,
            },
          }}
        />
        <ChatMessageMeta />
      </ChatMessage>
    </ChatMessageGroup>
  );
}

const EMPTY_QUERY_RESULTS = new Map() as unknown as ReadonlyMap<string, never>;

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

/**
 * Compact chip strip rendered above the composer that surfaces the
 * suggestions emitted by the backend on every assistant turn
 * (`message.metadata.suggestions`). Stays visible after the empty-state
 * hero is gone (via `alwaysVisible`) so users always have a one-tap
 * follow-up. Renders nothing while the latest assistant message has no
 * suggestions yet.
 */
function CopilotPostTurnSuggestions() {
  const { messages } = useChat();
  const lastSuggestions = React.useMemo<string[] | undefined>(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const m = messages[i];
      if (m.role !== 'assistant') {
        continue;
      }
      const metadata = m.metadata as { suggestions?: unknown } | undefined;
      if (metadata?.suggestions && Array.isArray(metadata.suggestions)) {
        const stringSuggestions = metadata.suggestions.filter(
          (s): s is string => typeof s === 'string',
        );
        return stringSuggestions.length > 0 ? stringSuggestions : undefined;
      }
      return undefined;
    }
    return undefined;
  }, [messages]);

  if (!lastSuggestions || lastSuggestions.length === 0) {
    return null;
  }

  return (
    <PostTurnSuggestionsShell>
      <ChatSuggestions suggestions={lastSuggestions.slice(0, 4)} alwaysVisible autoSubmit />
    </PostTurnSuggestionsShell>
  );
}

function CopilotComposer() {
  return (
    <CopilotComposerShell>
      <CopilotPostTurnSuggestions />
      <ChatComposer
        variant="compact"
        features={{ attachments: false }}
        sx={{
          margin: 0,
        }}
      />
      <CopilotDisclaimer>Copilot can make mistakes. Check important results.</CopilotDisclaimer>
    </CopilotComposerShell>
  );
}

// Custom messageListContent slot that appends a dynamic spacer after the
// rendered rows. The spacer claims one viewport-worth of vertical space
// after the most recent user message so submitting a new prompt scrolls
// it cleanly to the top of the visible area, leaving room below for the
// assistant response to stream into.
const CopilotMessageListContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ownerState?: unknown }
>(function CopilotMessageListContent(props, ref) {
  const { children, ownerState, ...rest } = props;
  void ownerState;
  return (
    <div ref={ref} {...rest}>
      {children}
      <CopilotTurnSpacer />
    </div>
  );
});

CopilotMessageListContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.any,
} as any;

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

function CopilotThreadView({
  suggestions,
  pluginToolSlots,
}: {
  suggestions: Array<ChatSuggestion | string>;
  pluginToolSlots: Record<string, Partial<ToolPartSlots>>;
}) {
  const apiRef = useGridApiContext();
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    (params: { id: string }) => {
      return <CopilotMessageItem id={params.id} pluginToolSlots={pluginToolSlots} />;
    },
    [pluginToolSlots],
  );

  return (
    <CopilotThreadRoot>
      <CopilotThreadBody>
        <ChatMessageList
          items={messageIds}
          renderItem={renderItem}
          autoScroll
          overlay={
            <React.Fragment>
              {messageIds.length === 0 && (
                <CopilotEmptyThread>
                  <CopilotEmptyHero>
                    <CopilotEmptyHeroTitle>
                      {apiRef.current.getLocaleText('copilotPanelEmptyStateTitle')}
                    </CopilotEmptyHeroTitle>
                    <CopilotEmptyHeroHelper>
                      {apiRef.current.getLocaleText('copilotPanelEmptyStateHelper')}
                    </CopilotEmptyHeroHelper>
                  </CopilotEmptyHero>
                  <ChatSuggestions suggestions={suggestions.slice(0, 3)} autoSubmit />
                </CopilotEmptyThread>
              )}
              <ChatScrollToBottomAffordance />
            </React.Fragment>
          }
          sx={{
            backgroundColor: 'transparent',
            '& .MuiChatMessageList-content': {
              paddingBlock: 1,
            },
          }}
          slots={{
            messageListContent: CopilotMessageListContent,
          }}
          slotProps={{
            messageListOverlay: {
              style: {
                top: 0,
                display: 'flex',
              },
            },
          }}
        />
      </CopilotThreadBody>
      <CopilotComposer />
    </CopilotThreadRoot>
  );
}

type CopilotPanelView = 'thread' | 'menu' | 'history' | 'suggestions';

interface CopilotPanelContentProps {
  suggestions: Array<ChatSuggestion | string>;
  view: CopilotPanelView;
  pluginToolSlots: Record<string, Partial<ToolPartSlots>>;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onSelectConversation: (conversationId: string) => void;
  onOpenHistory: () => void;
  onOpenSuggestions: () => void;
  onNewConversation: () => void;
}

function CopilotThreadHeader({
  onOpenMenu,
  onNewConversation,
}: Pick<CopilotPanelContentProps, 'onOpenMenu' | 'onNewConversation'>) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);

  return (
    <CopilotPanelHeader className={classes.header}>
      <CopilotPanelTitleGroup className={classes.titleGroup}>
        <rootProps.slots.baseIconButton
          {...rootProps.slotProps?.baseIconButton}
          aria-label={apiRef.current.getLocaleText('copilotPanelMenu')}
          onClick={onOpenMenu}
        >
          <GridMenuIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
        <CopilotPanelTitle className={classes.title}>
          {apiRef.current.getLocaleText('copilotPanelTitle')}
        </CopilotPanelTitle>
        <CopilotPanelBeta className={classes.beta}>
          {apiRef.current.getLocaleText('copilotPanelBeta')}
        </CopilotPanelBeta>
      </CopilotPanelTitleGroup>
      <rootProps.slots.baseIconButton
        {...rootProps.slotProps?.baseIconButton}
        aria-label={apiRef.current.getLocaleText('copilotPanelReload')}
        onClick={onNewConversation}
      >
        <rootProps.slots.aiAssistantPanelNewConversationIcon fontSize="small" />
      </rootProps.slots.baseIconButton>
      <rootProps.slots.baseIconButton
        {...rootProps.slotProps?.baseIconButton}
        aria-label={apiRef.current.getLocaleText('copilotPanelClose')}
        onClick={() => apiRef.current.hideSidebar()}
      >
        <rootProps.slots.copilotPanelCloseIcon fontSize="small" />
      </rootProps.slots.baseIconButton>
    </CopilotPanelHeader>
  );
}

function CopilotMenuHeaderView({
  title,
  onBack,
  onNewConversation,
}: {
  title?: string;
  onBack: () => void;
  onNewConversation?: () => void;
}) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <CopilotMenuHeader>
      <rootProps.slots.baseIconButton
        {...rootProps.slotProps?.baseIconButton}
        aria-label={apiRef.current.getLocaleText('copilotPanelBack')}
        onClick={onBack}
      >
        <CopilotChevronLeftIcon fontSize="small" />
      </rootProps.slots.baseIconButton>
      {title ? (
        <CopilotMenuHeaderTitle>{title}</CopilotMenuHeaderTitle>
      ) : (
        <CopilotMenuHeaderSpacer />
      )}
      {onNewConversation ? (
        <rootProps.slots.baseIconButton
          {...rootProps.slotProps?.baseIconButton}
          aria-label={apiRef.current.getLocaleText('copilotPanelReload')}
          onClick={onNewConversation}
        >
          <CopilotComposeIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      ) : null}
      <rootProps.slots.baseIconButton
        {...rootProps.slotProps?.baseIconButton}
        aria-label={apiRef.current.getLocaleText('copilotPanelClose')}
        onClick={() => apiRef.current.hideSidebar()}
      >
        <rootProps.slots.copilotPanelCloseIcon fontSize="small" />
      </rootProps.slots.baseIconButton>
    </CopilotMenuHeader>
  );
}

function CopilotMenuSectionView({
  title,
  showViewAll = true,
  onViewAll,
  children,
}: {
  title: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  children: React.ReactNode;
}) {
  const apiRef = useGridApiContext();

  return (
    <CopilotMenuSection>
      <CopilotMenuSectionHeader>
        <CopilotMenuSectionTitle>{title}</CopilotMenuSectionTitle>
        {showViewAll && onViewAll ? (
          <CopilotMenuSectionAction type="button" onClick={onViewAll}>
            {apiRef.current.getLocaleText('copilotPanelViewAll')}
          </CopilotMenuSectionAction>
        ) : null}
      </CopilotMenuSectionHeader>
      {children}
    </CopilotMenuSection>
  );
}

function CopilotMenuView({
  suggestions,
  onBack,
  onNewConversation,
  onSelectConversation,
  onSelectSuggestion,
  onOpenHistory,
  onOpenSuggestions,
}: {
  suggestions: Array<ChatSuggestion | string>;
  onBack: () => void;
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  onSelectSuggestion: () => void;
  onOpenHistory: () => void;
  onOpenSuggestions: () => void;
}) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const { activeConversationId, conversations, setActiveConversation } = useChat();
  const composer = useChatComposer();

  const handleConversationClick = React.useCallback(
    async (conversationId: string) => {
      await setActiveConversation(conversationId);
      onSelectConversation(conversationId);
    },
    [onSelectConversation, setActiveConversation],
  );

  const handleSuggestionClick = React.useCallback(
    (value: string) => {
      onSelectSuggestion();
      composer.setValue(value);
      void Promise.resolve().then(() => composer.submit());
    },
    [composer, onSelectSuggestion],
  );

  return (
    <CopilotMenuRoot>
      <CopilotMenuHeaderView onBack={onBack} onNewConversation={onNewConversation} />
      <CopilotMenuContent>
        <CopilotMenuSectionView
          title={apiRef.current.getLocaleText('copilotPanelHistory')}
          showViewAll={conversations.length > 0}
          onViewAll={onOpenHistory}
        >
          <CopilotMenuList>
            {conversations.length === 0 ? (
              <rootProps.slots.baseMenuItem
                inert
                iconStart={<CopilotSubjectIcon fontSize="small" />}
              >
                {apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation')}
              </rootProps.slots.baseMenuItem>
            ) : (
              conversations.slice(0, 5).map((conversation) => (
                <rootProps.slots.baseMenuItem
                  key={conversation.id}
                  aria-current={conversation.id === activeConversationId ? 'true' : undefined}
                  selected={conversation.id === activeConversationId}
                  iconStart={<CopilotSubjectIcon fontSize="small" />}
                  onClick={() => {
                    void handleConversationClick(conversation.id);
                  }}
                >
                  {conversation.title ?? conversation.subtitle ?? conversation.id}
                </rootProps.slots.baseMenuItem>
              ))
            )}
          </CopilotMenuList>
        </CopilotMenuSectionView>

        <CopilotMenuSectionView
          title={apiRef.current.getLocaleText('copilotPanelMoreSuggestions')}
          onViewAll={onOpenSuggestions}
        >
          <CopilotMenuList>
            {suggestions.map((suggestion) => {
              const value = getSuggestionValue(suggestion);
              return (
                <rootProps.slots.baseMenuItem
                  key={value}
                  iconStart={<CopilotReturnArrowIcon fontSize="small" />}
                  onClick={() => handleSuggestionClick(value)}
                >
                  {getSuggestionLabel(suggestion)}
                </rootProps.slots.baseMenuItem>
              );
            })}
          </CopilotMenuList>
        </CopilotMenuSectionView>

        <CopilotMenuSection>
          <CopilotMenuList>
            <rootProps.slots.baseMenuItem
              iconStart={<CopilotSettingsIcon fontSize="small" />}
              iconEnd={
                <CopilotMenuRowTrailing>
                  <CopilotMenuBadge>New</CopilotMenuBadge>
                  <CopilotChevronRightIcon fontSize="small" />
                </CopilotMenuRowTrailing>
              }
            >
              {apiRef.current.getLocaleText('copilotPanelSettings')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem iconStart={<CopilotFeedbackIcon fontSize="small" />}>
              {apiRef.current.getLocaleText('copilotPanelSendFeedback')}
            </rootProps.slots.baseMenuItem>
            <rootProps.slots.baseMenuItem iconStart={<CopilotReportIcon fontSize="small" />}>
              {apiRef.current.getLocaleText('copilotPanelReport')}
            </rootProps.slots.baseMenuItem>
          </CopilotMenuList>
        </CopilotMenuSection>
      </CopilotMenuContent>
    </CopilotMenuRoot>
  );
}

const CopilotListItemSubtitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'CopilotPanelListItemSubtitle',
})({
  display: 'block',
  font: vars.typography.font.small,
  color: vars.colors.foreground.muted,
});

function CopilotHistoryListView({
  onBack,
  onNewConversation,
  onSelectConversation,
}: {
  onBack: () => void;
  onNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
}) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const { activeConversationId, conversations, setActiveConversation } = useChat();

  const handleConversationClick = React.useCallback(
    async (conversationId: string) => {
      await setActiveConversation(conversationId);
      onSelectConversation(conversationId);
    },
    [onSelectConversation, setActiveConversation],
  );

  const sessionConversations = activeConversationId
    ? conversations.filter((conversation) => conversation.id === activeConversationId)
    : [];
  const otherConversations = activeConversationId
    ? conversations.filter((conversation) => conversation.id !== activeConversationId)
    : conversations;

  const todayLabel = apiRef.current.getLocaleText('copilotPanelToday');
  const yesterdayLabel = apiRef.current.getLocaleText('copilotPanelYesterday');

  const renderItem = (conversation: {
    id: string;
    title?: string;
    subtitle?: string;
    lastMessageAt?: string | number | Date | null;
  }) => {
    const subtitle =
      formatConversationDate(conversation.lastMessageAt, todayLabel, yesterdayLabel) ??
      conversation.subtitle;
    return (
      <rootProps.slots.baseMenuItem
        key={conversation.id}
        aria-current={conversation.id === activeConversationId ? 'true' : undefined}
        selected={conversation.id === activeConversationId}
        iconStart={<CopilotSubjectIcon fontSize="small" />}
        onClick={() => {
          void handleConversationClick(conversation.id);
        }}
      >
        {subtitle ? (
          <React.Fragment>
            <span>{conversation.title ?? conversation.id}</span>
            <CopilotListItemSubtitle>{subtitle}</CopilotListItemSubtitle>
          </React.Fragment>
        ) : (
          (conversation.title ?? conversation.id)
        )}
      </rootProps.slots.baseMenuItem>
    );
  };

  return (
    <CopilotMenuRoot>
      <CopilotMenuHeaderView
        title={apiRef.current.getLocaleText('copilotPanelHistory')}
        onBack={onBack}
        onNewConversation={onNewConversation}
      />
      <CopilotMenuContent>
        {sessionConversations.length > 0 ? (
          <React.Fragment>
            <CopilotListGroupHeader>
              {apiRef.current.getLocaleText('copilotPanelSession')}
            </CopilotListGroupHeader>
            <CopilotMenuList>{sessionConversations.map(renderItem)}</CopilotMenuList>
          </React.Fragment>
        ) : null}
        {otherConversations.length > 0 ? (
          <React.Fragment>
            <CopilotListGroupHeader>
              {apiRef.current.getLocaleText('copilotPanelAll')}
            </CopilotListGroupHeader>
            <CopilotMenuList>{otherConversations.map(renderItem)}</CopilotMenuList>
          </React.Fragment>
        ) : null}
        {sessionConversations.length === 0 && otherConversations.length === 0 ? (
          <CopilotMenuList>
            <rootProps.slots.baseMenuItem inert iconStart={<CopilotSubjectIcon fontSize="small" />}>
              {apiRef.current.getLocaleText('aiAssistantPanelEmptyConversation')}
            </rootProps.slots.baseMenuItem>
          </CopilotMenuList>
        ) : null}
      </CopilotMenuContent>
    </CopilotMenuRoot>
  );
}

function CopilotSuggestionsListView({
  suggestions,
  onBack,
  onSelectSuggestion,
}: {
  suggestions: Array<ChatSuggestion | string>;
  onBack: () => void;
  onSelectSuggestion: (value: string) => void;
}) {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  return (
    <CopilotMenuRoot>
      <CopilotMenuHeaderView
        title={apiRef.current.getLocaleText('copilotPanelMoreSuggestions')}
        onBack={onBack}
      />
      <CopilotMenuContent>
        <CopilotListGroupHeader>
          {apiRef.current.getLocaleText('copilotPanelAsk')}
        </CopilotListGroupHeader>
        <CopilotMenuList>
          {suggestions.map((suggestion) => {
            const value = getSuggestionValue(suggestion);
            return (
              <rootProps.slots.baseMenuItem
                key={value}
                iconStart={<CopilotReturnArrowIcon fontSize="small" />}
                onClick={() => onSelectSuggestion(value)}
              >
                {getSuggestionLabel(suggestion)}
              </rootProps.slots.baseMenuItem>
            );
          })}
        </CopilotMenuList>
      </CopilotMenuContent>
    </CopilotMenuRoot>
  );
}

function CopilotPanelContent(props: CopilotPanelContentProps) {
  const {
    suggestions,
    view,
    pluginToolSlots,
    onOpenMenu,
    onCloseMenu,
    onSelectConversation,
    onOpenHistory,
    onOpenSuggestions,
    onNewConversation,
  } = props;
  const composer = useChatComposer();

  const handleSelectSuggestion = React.useCallback(
    (value: string) => {
      onCloseMenu();
      composer.setValue(value);
      void Promise.resolve().then(() => composer.submit());
    },
    [composer, onCloseMenu],
  );

  if (view === 'menu') {
    return (
      <CopilotMenuView
        suggestions={suggestions}
        onBack={onCloseMenu}
        onNewConversation={onNewConversation}
        onSelectConversation={onSelectConversation}
        onSelectSuggestion={onCloseMenu}
        onOpenHistory={onOpenHistory}
        onOpenSuggestions={onOpenSuggestions}
      />
    );
  }

  if (view === 'history') {
    return (
      <CopilotHistoryListView
        onBack={onOpenMenu}
        onNewConversation={onNewConversation}
        onSelectConversation={onSelectConversation}
      />
    );
  }

  if (view === 'suggestions') {
    return (
      <CopilotSuggestionsListView
        suggestions={suggestions}
        onBack={onOpenMenu}
        onSelectSuggestion={handleSelectSuggestion}
      />
    );
  }

  return (
    <React.Fragment>
      <CopilotThreadHeader onOpenMenu={onOpenMenu} onNewConversation={onNewConversation} />
      <CopilotPanelBody>
        <CopilotThreadView suggestions={suggestions} pluginToolSlots={pluginToolSlots} />
      </CopilotPanelBody>
    </React.Fragment>
  );
}

function GridCopilotPanel() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const classes = useUtilityClasses(rootProps);
  const [view, setView] = React.useState<CopilotPanelView>('thread');
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
    setView('thread');
  }, [handleReload]);

  const handleSelectConversation = React.useCallback(
    (conversationId: string) => {
      activeConversationIdRef.current = conversationId;
      setActiveConversationId(conversationId);
      draftConversationIdRef.current = undefined;
      draftSentRef.current = false;
      localStorageController?.persistActiveConversationId(conversationId);
      restoreConversationGridState(conversationId);
      setView('thread');
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
          <CopilotPanelContent
            suggestions={rootProps.copilotSuggestions ?? DEFAULT_SUGGESTIONS}
            view={view}
            pluginToolSlots={pluginToolSlots}
            onOpenMenu={() => setView('menu')}
            onCloseMenu={() => setView('thread')}
            onSelectConversation={handleSelectConversation}
            onOpenHistory={() => setView('history')}
            onOpenSuggestions={() => setView('suggestions')}
            onNewConversation={handleNewConversation}
          />
        </ChatRoot>
      </CopilotPluginRenderProvider>
    </CopilotPanelRoot>
  );
}

export { GridCopilotPanel };
