'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { ChatSuggestion } from '@mui/x-chat-headless';
import { useChat, useChatComposer } from '@mui/x-chat-headless';
import { useCopilotPanelUtilityClasses, type CopilotPanelClasses } from './copilotPanelClasses';
import type { CopilotPanelIcons, CopilotPanelLocaleText } from './CopilotChatPanel.types';

export interface CopilotMenuViewProps {
  /** Suggestions rendered in the "More suggestions" section. */
  suggestions?: Array<ChatSuggestion | string>;
  /** Go back to the thread view. */
  onBack(): void;
  /** Start a new conversation. */
  onNewConversation(): void;
  /** Open the full conversation-history view. */
  onViewAllHistory(): void;
  /** Called after a conversation is selected (and made active). */
  onSelectConversation(conversationId: string): void;
  /** Optional handlers for the bottom menu rows; rows always render for parity. */
  onSettings?(): void;
  onSendFeedback?(): void;
  onReport?(): void;
  /** Localized strings. */
  localeText?: Partial<CopilotPanelLocaleText>;
  /** Icon overrides. */
  icons?: CopilotPanelIcons;
  /** Override or extend the styles applied to the component. */
  classes?: Partial<CopilotPanelClasses>;
}

const DEFAULT_TEXT: Pick<
  CopilotPanelLocaleText,
  | 'back'
  | 'history'
  | 'moreSuggestions'
  | 'viewAll'
  | 'settings'
  | 'sendFeedback'
  | 'report'
  | 'reload'
  | 'emptyConversation'
> = {
  back: 'Back',
  history: 'History',
  moreSuggestions: 'More suggestions',
  viewAll: 'View all',
  settings: 'Settings',
  sendFeedback: 'Send feedback',
  report: 'Report',
  reload: 'New conversation',
  emptyConversation: 'No conversations yet',
};

const MenuRoot = styled('div', { name: 'MuiCopilotMenuView', slot: 'Root' })({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const MenuHeader = styled('div', { name: 'MuiCopilotMenuView', slot: 'Header' })(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const MenuHeaderSpacer = styled('div')({ flex: 1 });

const MenuContent = styled('div', { name: 'MuiCopilotMenuView', slot: 'Content' })({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});

const MenuSection = styled('div', { name: 'MuiCopilotMenuView', slot: 'Section' })(({ theme }) => ({
  padding: theme.spacing(1, 0),
  '& + &': { borderTop: `1px solid ${(theme.vars || theme).palette.divider}` },
}));

const MenuSectionHeader = styled('div', { name: 'MuiCopilotMenuView', slot: 'SectionHeader' })(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5, 2),
  }),
);

const MenuSectionTitle = styled('span')(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: theme.typography.fontWeightMedium,
}));

const MenuSectionAction = styled('button')(({ theme }) => ({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: 0,
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
}));

const MenuBadge = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.primary.contrastText,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  borderRadius: 999,
  padding: theme.spacing(0, 0.75),
  marginRight: theme.spacing(0.5),
}));

const MenuRowTrailing = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: (theme.vars || theme).palette.text.secondary,
}));

function getSuggestionValue(suggestion: ChatSuggestion | string): string {
  return typeof suggestion === 'string' ? suggestion : suggestion.value;
}
function getSuggestionLabel(suggestion: ChatSuggestion | string): string {
  return typeof suggestion === 'string' ? suggestion : (suggestion.label ?? suggestion.value);
}

/**
 * The Copilot panel's "menu" view (opened by the header hamburger): a History
 * section (recent conversations + "View all"), a "More suggestions" section,
 * and the Settings / Send feedback / Report rows — mirroring the Data Grid
 * Premium panel. Host-agnostic: conversations come from the chat store, and the
 * bottom rows call optional handlers (they always render for visual parity).
 */
export function CopilotMenuView(props: CopilotMenuViewProps) {
  const {
    suggestions = [],
    onBack,
    onNewConversation,
    onViewAllHistory,
    onSelectConversation,
    onSettings,
    onSendFeedback,
    onReport,
    localeText,
    icons,
    classes: classesProp,
  } = props;
  const classes = useCopilotPanelUtilityClasses(classesProp);
  const { conversations, activeConversationId } = useChat();
  const composer = useChatComposer();

  const getText = <K extends keyof typeof DEFAULT_TEXT>(key: K): string =>
    localeText?.[key] ?? DEFAULT_TEXT[key];

  const BackIcon = icons?.back ?? ChevronLeftIcon;
  const NewIcon = icons?.newConversation ?? EditOutlinedIcon;
  const ConversationIcon = icons?.conversation ?? SubjectIcon;
  const SuggestionIcon = icons?.suggestion ?? SubdirectoryArrowLeftIcon;
  const SettingsIcon = icons?.settings ?? SettingsOutlinedIcon;
  const FeedbackIcon = icons?.feedback ?? FeedbackOutlinedIcon;
  const ReportIcon = icons?.report ?? ReportOutlinedIcon;
  const ChevronIcon = icons?.chevronRight ?? ChevronRightIcon;

  const handleConversationClick = React.useCallback(
    (conversationId: string) => {
      // Activation is owned by the panel's `onSelectConversation` handler (which
      // either calls the host override or activates via the chat store).
      onSelectConversation(conversationId);
    },
    [onSelectConversation],
  );

  const handleSuggestionClick = React.useCallback(
    (value: string) => {
      composer.setValue(value);
      void Promise.resolve().then(() => composer.submit());
    },
    [composer],
  );

  return (
    <MenuRoot className={clsx(classes.history)}>
      <MenuHeader className={classes.header}>
        <IconButton size="small" aria-label={getText('back')} onClick={onBack}>
          <BackIcon fontSize="small" />
        </IconButton>
        <MenuHeaderSpacer />
        <IconButton size="small" aria-label={getText('reload')} onClick={onNewConversation}>
          <NewIcon fontSize="small" />
        </IconButton>
      </MenuHeader>

      <MenuContent className={classes.body}>
        <MenuSection>
          <MenuSectionHeader>
            <MenuSectionTitle>{getText('history')}</MenuSectionTitle>
            {conversations.length > 0 ? (
              <MenuSectionAction type="button" onClick={onViewAllHistory}>
                {getText('viewAll')}
              </MenuSectionAction>
            ) : null}
          </MenuSectionHeader>
          <MenuList disablePadding>
            {conversations.length === 0 ? (
              <MenuItem disabled className={classes.historyItem}>
                <ListItemIcon>
                  <ConversationIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{getText('emptyConversation')}</ListItemText>
              </MenuItem>
            ) : (
              conversations.slice(0, 5).map((conversation) => (
                <MenuItem
                  key={conversation.id}
                  selected={conversation.id === activeConversationId}
                  className={classes.historyItem}
                  onClick={() => {
                    void handleConversationClick(conversation.id);
                  }}
                >
                  <ListItemIcon>
                    <ConversationIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{conversation.title ?? conversation.id}</ListItemText>
                </MenuItem>
              ))
            )}
          </MenuList>
        </MenuSection>

        {suggestions.length > 0 ? (
          <MenuSection>
            <MenuSectionHeader>
              <MenuSectionTitle>{getText('moreSuggestions')}</MenuSectionTitle>
            </MenuSectionHeader>
            <MenuList disablePadding>
              {suggestions.map((suggestion) => {
                const value = getSuggestionValue(suggestion);
                return (
                  <MenuItem key={value} onClick={() => handleSuggestionClick(value)}>
                    <ListItemIcon>
                      <SuggestionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{getSuggestionLabel(suggestion)}</ListItemText>
                  </MenuItem>
                );
              })}
            </MenuList>
          </MenuSection>
        ) : null}

        <MenuSection>
          <MenuList disablePadding>
            <MenuItem onClick={onSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{getText('settings')}</ListItemText>
              <MenuRowTrailing>
                <MenuBadge>New</MenuBadge>
                <ChevronIcon fontSize="small" />
              </MenuRowTrailing>
            </MenuItem>
            <MenuItem onClick={onSendFeedback}>
              <ListItemIcon>
                <FeedbackIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{getText('sendFeedback')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={onReport}>
              <ListItemIcon>
                <ReportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{getText('report')}</ListItemText>
            </MenuItem>
          </MenuList>
        </MenuSection>
      </MenuContent>
    </MenuRoot>
  );
}
