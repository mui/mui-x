'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ChatComposer } from '@mui/x-chat';
import { ChatRoot, useChat } from '@mui/x-chat-headless';
import type { ChatToolInvocationState } from '@mui/x-chat-headless';
import { CopilotThreadView } from './CopilotThreadView';
import { CopilotHistoryView } from './CopilotHistoryView';
import { CopilotMenuView } from './CopilotMenuView';
import { CopilotSuggestions } from './CopilotSuggestions';
import { CopilotFeedbackProvider } from './CopilotFeedbackProvider';
import { useCopilotPanelUtilityClasses } from './copilotPanelClasses';
import type {
  CopilotChatPanelContentProps,
  CopilotChatPanelProps,
  CopilotPanelLocaleText,
} from './CopilotChatPanel.types';

/**
 * Internal navigation state for the panel chrome. The thread (conversation) is
 * the default view; the hamburger toggles into the history list, and grid hosts
 * later layer the `menu` view on top via the same mechanism.
 */
type CopilotPanelView = 'thread' | 'menu' | 'history';

const DEFAULT_LOCALE_TEXT: CopilotPanelLocaleText = {
  title: 'Copilot',
  beta: 'BETA',
  menu: 'Open menu',
  back: 'Back',
  close: 'Close',
  reload: 'New conversation',
  history: 'History',
  session: 'This session',
  all: 'Earlier',
  today: 'Today',
  yesterday: 'Yesterday',
  viewAll: 'View all',
  ask: 'Ask',
  moreSuggestions: 'More suggestions',
  settings: 'Settings',
  sendFeedback: 'Send feedback',
  report: 'Report',
  emptyStateTitle: 'How can I help?',
  emptyStateHelper: 'Ask a question or pick a suggestion to get started.',
  emptyConversation: 'No conversations yet',
  suggestions: 'Suggestions',
  promptFieldLabel: 'Ask Copilot',
  promptFieldPlaceholder: 'Ask Copilot…',
  promptFieldSend: 'Send',
  disclaimer: 'Copilot can make mistakes. Check important results.',
};

// Tool-state labels for the panel's executor tools. These tools are
// passthrough: the frontend applies the patch / runs the command the moment the
// tool input is available and the backend never streams a tool *output*, so
// `input-available` is their terminal "done" state. The default x-chat label for
// `input-available` is "Running..." (it assumes an output is still coming),
// which would stick forever — map it to "Completed" instead. Other states keep
// the x-chat defaults.
const PANEL_TOOL_STATE_LABELS: Record<ChatToolInvocationState, string> = {
  'input-streaming': 'Running...',
  'input-available': 'Completed',
  'approval-requested': 'Awaiting approval',
  'approval-responded': 'Running...',
  'output-available': 'Completed',
  'output-error': 'Failed',
  'output-denied': 'Denied',
};

const PanelRoot = styled('div', {
  name: 'MuiCopilotChatPanel',
  slot: 'Root',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  width: '100%',
  overflow: 'hidden',
  background: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.primary,
}));

const PanelHeader = styled('div', {
  name: 'MuiCopilotChatPanel',
  slot: 'Header',
})(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  minHeight: 52,
  padding: theme.spacing(0, 0.75, 0, 1.5),
}));

const PanelTitleGroup = styled('div', {
  name: 'MuiCopilotChatPanel',
  slot: 'TitleGroup',
})(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

const PanelTitle = styled('span', {
  name: 'MuiCopilotChatPanel',
  slot: 'Title',
})(({ theme }) => ({
  ...theme.typography.body1,
  fontWeight: theme.typography.fontWeightMedium,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const PanelBeta = styled('span', {
  name: 'MuiCopilotChatPanel',
  slot: 'Beta',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  height: 20,
  padding: theme.spacing(0, 0.75),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  ...theme.typography.caption,
  fontWeight: theme.typography.fontWeightMedium,
  letterSpacing: 0.4,
  color: (theme.vars || theme).palette.primary.main,
  background: theme.alpha((theme.vars || theme).palette.primary.main, 0.12),
}));

const PanelBody = styled('div', {
  name: 'MuiCopilotChatPanel',
  slot: 'Body',
})({
  flex: 1,
  minHeight: 0,
  display: 'flex',
});

const ComposerShell = styled('div', {
  name: 'MuiCopilotChatPanel',
  slot: 'ComposerShell',
})(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0, 1.5, 1),
}));

const ComposerDisclaimer = styled('p', {
  name: 'MuiCopilotChatPanel',
  slot: 'Disclaimer',
})(({ theme }) => ({
  margin: 0,
  paddingBlock: theme.spacing(0.5),
  textAlign: 'center',
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
}));

/**
 * The inner panel — rendered inside `ChatRoot` so the chat store, conversation
 * layer, and composer context are available to every sub-view. Owns the view
 * state (thread / history) and wires the chrome callbacks. Split out from the
 * exported component so the `ChatRoot` provider can sit above it.
 */
export function CopilotChatPanelContent(props: CopilotChatPanelContentProps) {
  const {
    open,
    onOpenChange,
    suggestions,
    localeText: localeTextProp,
    icons,
    slots,
    toolSlots,
    showMetadataCard,
    onSwitchVariant,
    onNewConversation,
    onSelectConversation,
    authorName,
    classes: classesProp,
    className,
  } = props;

  const classes = useCopilotPanelUtilityClasses(classesProp);
  const { setActiveConversation } = useChat();
  const [view, setView] = React.useState<CopilotPanelView>('thread');

  const getText = React.useCallback(
    <K extends keyof CopilotPanelLocaleText>(key: K): string =>
      localeTextProp?.[key] ?? DEFAULT_LOCALE_TEXT[key],
    [localeTextProp],
  );

  const MenuButtonIcon = icons?.menu ?? MenuIcon;
  const CloseButtonIcon = icons?.close ?? CloseIcon;
  const NewConversationIcon = icons?.newConversation ?? EditOutlinedIcon;

  const handleNewConversation = React.useCallback(async () => {
    // When the host owns the conversation lifecycle (e.g. the Data Grid creates
    // a client-generated draft + captures baseline state), delegate to it rather
    // than resetting the chat store ourselves — bypassing the host would leave
    // its `activeConversationId` unset until the next send and trigger a spurious
    // history reload.
    if (onNewConversation) {
      onNewConversation();
    } else {
      await setActiveConversation(undefined);
    }
    setView('thread');
  }, [onNewConversation, setActiveConversation]);

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleSelectConversation = React.useCallback(
    async (conversationId: string) => {
      // The host (e.g. the Data Grid) owns activation + side-state restore when
      // it supplies `onSelectConversation`; otherwise the panel activates the
      // conversation itself via the chat store.
      if (onSelectConversation) {
        onSelectConversation(conversationId);
      } else {
        await setActiveConversation(conversationId);
      }
      setView('thread');
    },
    [onSelectConversation, setActiveConversation],
  );

  // The metadata card defaults: undefined → generic card when `showMetadataCard`,
  // otherwise rendered off (`null`). An explicit slot always wins.
  const metadataCard = slots?.metadataCard ?? (showMetadataCard ? undefined : null);

  return (
    <PanelRoot className={clsx(classes.root, className)} hidden={open === false}>
      {view === 'menu' && (
        <CopilotMenuView
          suggestions={suggestions}
          onBack={() => setView('thread')}
          onNewConversation={() => {
            void handleNewConversation();
          }}
          onViewAllHistory={() => setView('history')}
          onSelectConversation={handleSelectConversation}
          localeText={localeTextProp}
          icons={icons}
          classes={classesProp}
        />
      )}
      {view === 'history' && (
        <CopilotHistoryView
          onBack={() => setView('menu')}
          onSelectConversation={handleSelectConversation}
          onNewConversation={() => {
            void handleNewConversation();
          }}
          localeText={localeTextProp}
          icons={icons}
          classes={classesProp}
        />
      )}
      {view === 'thread' && (
        <React.Fragment>
          <PanelHeader className={classes.header}>
            <PanelTitleGroup>
              <IconButton size="small" aria-label={getText('menu')} onClick={() => setView('menu')}>
                <MenuButtonIcon fontSize="small" />
              </IconButton>
              <PanelTitle className={classes.title}>{getText('title')}</PanelTitle>
              <PanelBeta className={classes.beta}>{getText('beta')}</PanelBeta>
            </PanelTitleGroup>
            <IconButton
              size="small"
              aria-label={getText('reload')}
              onClick={() => {
                void handleNewConversation();
              }}
            >
              <NewConversationIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label={getText('close')} onClick={handleClose}>
              <CloseButtonIcon fontSize="small" />
            </IconButton>
          </PanelHeader>
          <PanelBody className={classes.body}>
            <CopilotThreadView
              suggestions={suggestions}
              localeText={localeTextProp}
              icons={icons}
              toolSlots={toolSlots}
              abVariantTabs={slots?.abVariantTabs}
              onSwitchVariant={onSwitchVariant}
              metadataCard={metadataCard}
              authorName={authorName}
              classes={classesProp}
            />
          </PanelBody>
          <ComposerShell className={classes.footer}>
            <CopilotSuggestions readFromLastMessage max={4} classes={classesProp} />
            {/* The composer's label/placeholder/send text is supplied via
                `ChatRoot`'s `localeText` in the exported component below. */}
            <ChatComposer
              className={classes.composer}
              variant="compact"
              features={{ attachments: false }}
              sx={{ margin: 0 }}
            />
            <ComposerDisclaimer>{getText('disclaimer')}</ComposerDisclaimer>
          </ComposerShell>
        </React.Fragment>
      )}
    </PanelRoot>
  );
}

/**
 * Generic, host-agnostic Copilot chat panel composed from `@mui/x-chat`
 * primitives. Renders the full side-panel UX the Data Grid Premium panel ships
 * today — a header (title + "BETA" badge, hamburger → history, "new
 * conversation", and a close affordance), the auto-scrolling thread with the
 * empty-state hero, a post-turn suggestions strip, the conversation-history
 * view, and the composer with a "Copilot can make mistakes" disclaimer —
 * driven entirely by props instead of `apiRef`/grid slots.
 *
 * All chrome text flows through `localeText` (English defaults), all icons
 * through `icons`, and every host-specific render block (applied changes,
 * data-query approval, A/B variant tabs, metadata card) is injected via
 * `slots`. The panel wraps its children in `ChatRoot` (so the chat store,
 * conversation layer, and composer context are available) and, when a
 * `feedback` handler is supplied, in `CopilotFeedbackProvider`.
 */
function CopilotChatPanel(props: CopilotChatPanelProps) {
  const {
    adapter,
    initialActiveConversationId,
    onFinish,
    feedback,
    currentUser,
    messageVariant,
    showAvatars,
    localeText,
    ...rest
  } = props;

  // Resolve the thread layout variant forwarded to x-chat's `ChatRoot`:
  // `messageVariant` wins; otherwise `showAvatars === false` maps to `'compact'`
  // (no avatars). When both are omitted, leave it undefined so `ChatRoot` falls
  // back to its `'default'` context value — existing behavior is unchanged.
  let resolvedVariant = messageVariant;
  if (resolvedVariant === undefined && showAvatars !== undefined) {
    resolvedVariant = showAvatars ? 'default' : 'compact';
  }

  // Forward the panel's prompt-field locale into the composer + suggestions via
  // ChatRoot's `localeText` (the real x-chat seam the composer reads from).
  const chatLocaleText = React.useMemo(
    () => ({
      composerInputAriaLabel: localeText?.promptFieldLabel ?? DEFAULT_LOCALE_TEXT.promptFieldLabel,
      composerInputPlaceholder:
        localeText?.promptFieldPlaceholder ?? DEFAULT_LOCALE_TEXT.promptFieldPlaceholder,
      composerSendButtonLabel: localeText?.promptFieldSend ?? DEFAULT_LOCALE_TEXT.promptFieldSend,
      suggestionsLabel: localeText?.suggestions ?? DEFAULT_LOCALE_TEXT.suggestions,
      toolStateLabel: (state: ChatToolInvocationState) => PANEL_TOOL_STATE_LABELS[state],
    }),
    [localeText],
  );

  let content = <CopilotChatPanelContent localeText={localeText} {...rest} />;
  if (feedback) {
    content = <CopilotFeedbackProvider submit={feedback}>{content}</CopilotFeedbackProvider>;
  }

  return (
    <ChatRoot
      adapter={adapter}
      initialActiveConversationId={initialActiveConversationId}
      onFinish={onFinish}
      currentUser={currentUser}
      variant={resolvedVariant}
      localeText={chatLocaleText}
      // `ChatRoot` renders a plain block `<div>` around its children. Make it a
      // flex-fill column so `PanelRoot`'s `flex: 1` resolves to a real height —
      // otherwise the wrapper shrink-wraps its content and, with an empty thread
      // (zero-height message list), the composer rides up under the header
      // instead of sitting at the bottom. (Hosts that mount
      // `CopilotChatPanelContent` directly, e.g. the Data Grid, neutralize this
      // same wrapper with `display: 'contents'` on their own `ChatRoot`.)
      slotProps={{
        root: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0,
          },
        },
      }}
    >
      {content}
    </ChatRoot>
  );
}

export { CopilotChatPanel };
export type { CopilotChatPanelProps };
