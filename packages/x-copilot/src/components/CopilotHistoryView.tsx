'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIosNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { useChat, useConversations } from '@mui/x-chat-headless';
import type { ChatConversation } from '@mui/x-chat-headless';
import type {
  CopilotPanelIcons,
  CopilotPanelLocaleText,
  HistoryCapableChatAdapter,
} from './CopilotChatPanel.types';
import { useCopilotPanelUtilityClasses } from './copilotPanelClasses';

export interface CopilotHistoryViewProps {
  /**
   * Chat adapter backing the conversation history. The conversation store is
   * hydrated from this adapter's `listConversations` by `ChatRoot`; the prop is
   * accepted so hosts can pass the same adapter they handed to `ChatRoot`.
   */
  // eslint-disable-next-line react/no-unused-prop-types -- accepted for API parity; data flows through the conversation store.
  adapter?: HistoryCapableChatAdapter;
  /** Called after a conversation is selected (and made active). */
  onSelectConversation?(conversationId: string): void;
  /** Called when the user requests a brand-new conversation. */
  onNewConversation?(): void;
  /** Called when the user deletes a conversation. When omitted, no delete affordance is shown. */
  onDeleteConversation?(conversationId: string): void;
  /** Called when the user navigates back from the history view. */
  onBack?(): void;
  /** Localized strings; overrides the English defaults per key. */
  localeText?: Partial<CopilotPanelLocaleText>;
  /** Icon overrides for the header and rows. */
  icons?: Pick<CopilotPanelIcons, 'back' | 'compose' | 'conversation'>;
  /** Override or extend the styles applied to the component. */
  classes?: Parameters<typeof useCopilotPanelUtilityClasses>[0];
  /** Class name applied to the root element. */
  className?: string;
}

const DEFAULT_LOCALE_TEXT: Pick<
  CopilotPanelLocaleText,
  'history' | 'session' | 'all' | 'today' | 'yesterday' | 'back' | 'reload' | 'emptyConversation'
> = {
  history: 'History',
  session: 'This session',
  all: 'Earlier',
  today: 'Today',
  yesterday: 'Yesterday',
  back: 'Back',
  reload: 'New conversation',
  emptyConversation: 'No conversations yet',
};

const HistoryRoot = styled('div', {
  name: 'MuiCopilotHistoryView',
  slot: 'Root',
})(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: (theme.vars || theme).palette.background.paper,
}));

const HistoryHeader = styled('div', {
  name: 'MuiCopilotHistoryView',
  slot: 'Header',
})(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minHeight: 52,
  padding: theme.spacing(0, 0.75),
}));

const HistoryHeaderTitle = styled('div', {
  name: 'MuiCopilotHistoryView',
  slot: 'HeaderTitle',
})(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightBold,
  color: (theme.vars || theme).palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingInlineStart: theme.spacing(0.5),
}));

const HistoryContent = styled('div', {
  name: 'MuiCopilotHistoryView',
  slot: 'Content',
})(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: theme.spacing(0.5, 1, 2),
}));

const HistoryGroupHeader = styled('div', {
  name: 'MuiCopilotHistoryView',
  slot: 'GroupHeader',
})(({ theme }) => ({
  padding: theme.spacing(1.5, 1.25, 0.5),
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
}));

const HistoryList = styled(MenuList, {
  name: 'MuiCopilotHistoryView',
  slot: 'List',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  '& .MuiMenuItem-root': {
    borderRadius: (theme.vars || theme).shape.borderRadius,
    minHeight: 40,
    paddingBlock: theme.spacing(0.5),
    paddingInline: theme.spacing(1.25),
    gap: theme.spacing(1),
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    color: (theme.vars || theme).palette.text.secondary,
  },
  '& .MuiListItemText-root': {
    margin: 0,
  },
}));

const HistoryItemSubtitle = styled('span', {
  name: 'MuiCopilotHistoryView',
  slot: 'ItemSubtitle',
})(({ theme }) => ({
  display: 'block',
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
}));

const HistoryItemDelete = styled(IconButton, {
  name: 'MuiCopilotHistoryView',
  slot: 'ItemDelete',
})(({ theme }) => ({
  marginInlineStart: theme.spacing(0.5),
  color: (theme.vars || theme).palette.text.secondary,
}));

const HistoryEmpty = styled('div', {
  name: 'MuiCopilotHistoryView',
  slot: 'Empty',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.25),
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
}));

/**
 * Format a conversation's last-activity timestamp as a short relative date.
 * Returns `today`/`yesterday` labels for recent items and the locale date
 * string otherwise. Mirrors the Data Grid Premium panel's behavior.
 */
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
  const startOfDay = (input: Date) =>
    new Date(input.getFullYear(), input.getMonth(), input.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);
  if (diffDays <= 0) {
    return todayLabel;
  }
  if (diffDays === 1) {
    return yesterdayLabel;
  }
  return date.toLocaleDateString();
}

/**
 * Host-agnostic conversation history view for the Copilot panel. Reads the
 * conversation list from the `@mui/x-chat-headless` conversation layer (hydrated
 * by `ChatRoot` from the adapter's `listConversations`), groups it into
 * "This session" (the active conversation) and "Earlier" (everything else),
 * and exposes select / new-conversation / delete callbacks. Generalizes the
 * Data Grid Premium panel's history view away from `apiRef` and grid slots.
 */
function CopilotHistoryView(props: CopilotHistoryViewProps) {
  const {
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    onBack,
    localeText,
    icons,
    classes: classesProp,
    className,
  } = props;

  const classes = useCopilotPanelUtilityClasses(classesProp);
  const { activeConversationId } = useChat();
  const conversations = useConversations();

  const getText = <K extends keyof typeof DEFAULT_LOCALE_TEXT>(key: K): string =>
    localeText?.[key] ?? DEFAULT_LOCALE_TEXT[key];

  const BackIcon = icons?.back ?? ArrowBackIcon;
  const ComposeIcon = icons?.compose ?? EditOutlinedIcon;
  const ConversationIcon = icons?.conversation ?? SubjectIcon;

  const handleConversationClick = React.useCallback(
    (conversationId: string) => {
      // Activation is owned by the panel's `onSelectConversation` handler (which
      // either calls the host override or activates via the chat store).
      onSelectConversation?.(conversationId);
    },
    [onSelectConversation],
  );

  const sessionConversations = activeConversationId
    ? conversations.filter((conversation) => conversation.id === activeConversationId)
    : [];
  const otherConversations = activeConversationId
    ? conversations.filter((conversation) => conversation.id !== activeConversationId)
    : conversations;

  const todayLabel = getText('today');
  const yesterdayLabel = getText('yesterday');

  const renderItem = (conversation: ChatConversation) => {
    const subtitle =
      formatConversationDate(conversation.lastMessageAt, todayLabel, yesterdayLabel) ??
      conversation.subtitle;
    const title = conversation.title ?? conversation.id;
    const isActive = conversation.id === activeConversationId;
    return (
      <MenuItem
        key={conversation.id}
        className={classes.historyItem}
        aria-current={isActive ? 'true' : undefined}
        selected={isActive}
        onClick={() => {
          void handleConversationClick(conversation.id);
        }}
      >
        <ListItemIcon>
          <ConversationIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={title}
          secondary={subtitle ? <HistoryItemSubtitle>{subtitle}</HistoryItemSubtitle> : null}
          slotProps={{ primary: { noWrap: true } }}
        />
        {onDeleteConversation ? (
          <HistoryItemDelete
            size="small"
            edge="end"
            aria-label={`Delete ${title}`}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </HistoryItemDelete>
        ) : null}
      </MenuItem>
    );
  };

  const isEmpty = sessionConversations.length === 0 && otherConversations.length === 0;

  return (
    <HistoryRoot className={clsx(classes.history, className)}>
      <HistoryHeader className={classes.header}>
        {onBack ? (
          <IconButton size="small" aria-label={getText('back')} onClick={onBack}>
            <BackIcon fontSize="small" />
          </IconButton>
        ) : null}
        <HistoryHeaderTitle>{getText('history')}</HistoryHeaderTitle>
        {onNewConversation ? (
          <IconButton size="small" aria-label={getText('reload')} onClick={onNewConversation}>
            <ComposeIcon fontSize="small" />
          </IconButton>
        ) : null}
      </HistoryHeader>
      <HistoryContent className={classes.body}>
        {sessionConversations.length > 0 ? (
          <React.Fragment>
            <HistoryGroupHeader>{getText('session')}</HistoryGroupHeader>
            <HistoryList>{sessionConversations.map(renderItem)}</HistoryList>
          </React.Fragment>
        ) : null}
        {otherConversations.length > 0 ? (
          <React.Fragment>
            <HistoryGroupHeader>{getText('all')}</HistoryGroupHeader>
            <HistoryList>{otherConversations.map(renderItem)}</HistoryList>
          </React.Fragment>
        ) : null}
        {isEmpty ? (
          <HistoryEmpty>
            <ConversationIcon fontSize="small" />
            <span>{getText('emptyConversation')}</span>
          </HistoryEmpty>
        ) : null}
      </HistoryContent>
    </HistoryRoot>
  );
}

export { CopilotHistoryView };
