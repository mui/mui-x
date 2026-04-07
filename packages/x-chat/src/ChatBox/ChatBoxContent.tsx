'use client';
import * as React from 'react';
import { useMessage, useMessageIds, useConversations } from '@mui/x-chat-headless';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  ChatLayout,
  useChatLocaleText,
  useChatVariant,
  type ChatSuggestion,
  type ChatVariant,
} from '@mui/x-chat-headless';
import { styled } from '../internals/zero-styled';
import { ChatConversation } from '../ChatConversation/ChatConversation';
import { ChatConversationHeader } from '../ChatConversation/ChatConversationHeader';
import { ChatConversationTitle } from '../ChatConversation/ChatConversationTitle';
import { ChatConversationSubtitle } from '../ChatConversation/ChatConversationSubtitle';
import { ChatConversationHeaderInfo } from '../ChatConversation/ChatConversationHeaderInfo';
import { ChatConversationHeaderActions } from '../ChatConversation/ChatConversationHeaderActions';
import { ChatConversationList } from '../ChatConversationList/ChatConversationList';
import { ChatComposer } from '../ChatComposer/ChatComposer';
import { ChatComposerTextArea } from '../ChatComposer/ChatComposerTextArea';
import { ChatComposerSendButton } from '../ChatComposer/ChatComposerSendButton';
import { ChatComposerAttachButton } from '../ChatComposer/ChatComposerAttachButton';
import { ChatComposerAttachmentList } from '../ChatComposer/ChatComposerAttachmentList';
import { ChatComposerToolbar } from '../ChatComposer/ChatComposerToolbar';
import { ChatComposerHelperText } from '../ChatComposer/ChatComposerHelperText';
import { ChatMessageList } from '../ChatMessageList/ChatMessageList';
import { ChatMessageGroup } from '../ChatMessage/ChatMessageGroup';
import { ChatMessageContent } from '../ChatMessage/ChatMessageContent';
import { ChatMessageMeta } from '../ChatMessage/ChatMessageMeta';
import { ChatMessageAvatar } from '../ChatMessage/ChatMessageAvatar';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatMessageActions } from '../ChatMessage/ChatMessageActions';
import { ChatMessageInlineMeta } from '../ChatMessage/ChatMessageInlineMeta';
import { ChatScrollToBottomAffordance } from '../ChatIndicators/ChatScrollToBottomAffordance';
import { ChatSuggestions } from '../ChatSuggestions/ChatSuggestions';
import type { ChatBoxSlots, ChatBoxSlotProps, ChatBoxFeatures } from './ChatBox.types';
import DefaultSendIcon from '../icons/DefaultSendIcon';
import DefaultAttachIcon from '../icons/DefaultAttachIcon';
import DefaultMenuIcon from '../icons/DefaultMenuIcon';

const NARROW_BREAKPOINT = 600;

/**
 * Observes the ChatBox root element's inline size and returns `true`
 * when it is narrower than the breakpoint. This mirrors the
 * `@container (max-width: 599.95px)` rule used in CSS so the JS
 * side can show/hide the drawer and menu button in sync.
 */
function useContainerNarrow(ref: React.RefObject<HTMLElement | null>): boolean {
  const [narrow, setNarrow] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
        setNarrow(width < NARROW_BREAKPOINT);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return narrow;
}

const ChatBoxEmptyState = styled('div', {
  name: 'MuiChatBox',
  slot: 'EmptyState',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  color: (theme.vars || theme).palette.text.secondary,
  padding: theme.spacing(4),
  userSelect: 'none',
  pointerEvents: 'none',
}));

const ChatBoxEmptyStateIcon = styled('svg', {
  name: 'MuiChatBox',
  slot: 'EmptyStateIcon',
})(({ theme }) => ({
  width: 48,
  height: 48,
  color: (theme.vars || theme).palette.action.disabled,
  marginBottom: theme.spacing(1),
}));

const ChatBoxEmptyStateTitle = styled('p', {
  name: 'MuiChatBox',
  slot: 'EmptyStateTitle',
})(({ theme }) => ({
  margin: 0,
  ...theme.typography.subtitle1,
  color: (theme.vars || theme).palette.text.secondary,
}));

const ChatBoxEmptyStateHelper = styled('p', {
  name: 'MuiChatBox',
  slot: 'EmptyStateHelper',
})(({ theme }) => ({
  margin: 0,
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.disabled,
}));

interface ChatBoxContentProps {
  variant?: ChatVariant;
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
  rootRef: React.RefObject<HTMLElement | null>;
  layoutClassName?: string;
  conversationsPaneClassName?: string;
  threadPaneClassName?: string;
  suggestions?: Array<ChatSuggestion | string>;
  suggestionsAutoSubmit?: boolean;
}

function DefaultMessageItem({
  id,
  slots,
  slotProps,
}: {
  id: string;
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
}) {
  const variant = useChatVariant();
  const message = useMessage(id);
  const MessageGroupComponent = (slots?.messageGroup ??
    ChatMessageGroup) as typeof ChatMessageGroup;
  const MessageAvatarComponent = (slots?.messageAvatar ??
    ChatMessageAvatar) as typeof ChatMessageAvatar;
  const MessageContentComponent = (slots?.messageContent ??
    ChatMessageContent) as typeof ChatMessageContent;
  const MessageMetaComponent = (slots?.messageMeta ?? ChatMessageMeta) as typeof ChatMessageMeta;
  const MessageRootComponent = (slots?.messageRoot ?? ChatMessage) as typeof ChatMessage;
  const MessageActionsSlot = slots?.messageActions;

  const isDefault = variant !== 'compact';
  const isStreaming = message?.status === 'streaming';

  // Default variant: inline meta inside the bubble (Telegram-style).
  // Skip during streaming — there is no timestamp yet, and the streaming state
  // is already communicated via the MuiChatMessage-streaming CSS class.
  // Also skip when the message carries no displayable meta at all (no timestamp,
  // no edited label, no delivery status) so the spacer does not add dead space.
  const hasMeta =
    Boolean(message?.createdAt) || Boolean(message?.editedAt) || Boolean(message?.status);
  const inlineMeta = isDefault && !isStreaming && hasMeta ? <ChatMessageInlineMeta /> : undefined;

  return (
    <MessageGroupComponent messageId={id} {...(slotProps?.messageGroup ?? {})}>
      <MessageRootComponent messageId={id} {...(slotProps?.messageRoot ?? {})}>
        <MessageAvatarComponent {...(slotProps?.messageAvatar ?? {})} />
        <MessageContentComponent {...(slotProps?.messageContent ?? {})} afterContent={inlineMeta} />
        {/* External meta is only used in the compact variant */}
        {!isDefault && <MessageMetaComponent {...(slotProps?.messageMeta ?? {})} />}
        {MessageActionsSlot && (
          <ChatMessageActions {...(slotProps?.messageActions ?? {})}>
            <MessageActionsSlot messageId={id} />
          </ChatMessageActions>
        )}
      </MessageRootComponent>
    </MessageGroupComponent>
  );
}

function DefaultConversationHeader({
  slots,
  slotProps,
  features,
  onMenuClick,
  showMenuButton,
}: {
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}) {
  const localeText = useChatLocaleText();

  if (features?.conversationHeader === false) {
    return null;
  }
  const ConversationHeaderComponent = (slots?.conversationHeader ??
    ChatConversationHeader) as typeof ChatConversationHeader;
  const ConversationHeaderInfoComponent = (slots?.conversationHeaderInfo ??
    ChatConversationHeaderInfo) as typeof ChatConversationHeaderInfo;
  const ConversationTitleComponent = (slots?.conversationTitle ??
    ChatConversationTitle) as typeof ChatConversationTitle;
  const ConversationSubtitleComponent = (slots?.conversationSubtitle ??
    ChatConversationSubtitle) as typeof ChatConversationSubtitle;
  const ConversationHeaderActionsComponent = (slots?.conversationHeaderActions ??
    ChatConversationHeaderActions) as typeof ChatConversationHeaderActions;

  return (
    <ConversationHeaderComponent {...(slotProps?.conversationHeader ?? {})}>
      {showMenuButton && (
        <Tooltip title={localeText.conversationHeaderMenuLabel}>
          <IconButton
            size="small"
            aria-label={localeText.conversationHeaderMenuLabel}
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <DefaultMenuIcon />
          </IconButton>
        </Tooltip>
      )}
      <ConversationHeaderInfoComponent {...(slotProps?.conversationHeaderInfo ?? {})}>
        <ConversationTitleComponent {...(slotProps?.conversationTitle ?? {})} />
        <ConversationSubtitleComponent {...(slotProps?.conversationSubtitle ?? {})} />
      </ConversationHeaderInfoComponent>
      <ConversationHeaderActionsComponent {...(slotProps?.conversationHeaderActions ?? {})} />
    </ConversationHeaderComponent>
  );
}

function DefaultComposer({
  slots,
  slotProps,
  features,
}: {
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
}) {
  const contextVariant = useChatVariant();
  const variant = slotProps?.composerRoot?.variant ?? contextVariant;
  const showAttachments = features?.attachments !== false;
  const showHelperText = features?.helperText !== false;
  const attachmentConfig =
    typeof features?.attachments === 'object' ? features.attachments : undefined;
  const ComposerRootComponent = (slots?.composerRoot ?? ChatComposer) as typeof ChatComposer;
  const ComposerInputComponent = (slots?.composerInput ??
    ChatComposerTextArea) as typeof ChatComposerTextArea;
  const ComposerToolbarComponent = (slots?.composerToolbar ??
    ChatComposerToolbar) as typeof ChatComposerToolbar;
  const ComposerSendButtonComponent = (slots?.composerSendButton ??
    ChatComposerSendButton) as typeof ChatComposerSendButton;
  const ComposerAttachButtonComponent = (slots?.composerAttachButton ??
    ChatComposerAttachButton) as typeof ChatComposerAttachButton;
  const ComposerAttachmentListComponent = (slots?.composerAttachmentList ??
    ChatComposerAttachmentList) as typeof ChatComposerAttachmentList;
  const ComposerHelperTextComponent = (slots?.composerHelperText ??
    ChatComposerHelperText) as typeof ChatComposerHelperText;
  const localeText = useChatLocaleText();

  if (variant === 'compact') {
    return (
      <ComposerRootComponent
        variant="compact"
        attachmentConfig={attachmentConfig}
        {...(slotProps?.composerRoot ?? {})}
      >
        {showAttachments && (
          <ComposerAttachmentListComponent {...(slotProps?.composerAttachmentList ?? {})} />
        )}
        {showAttachments && (
          <ComposerAttachButtonComponent
            aria-label={localeText.composerAttachButtonLabel}
            {...(slotProps?.composerAttachButton ?? {})}
          >
            <DefaultAttachIcon />
          </ComposerAttachButtonComponent>
        )}
        <ComposerInputComponent
          maxRows={5}
          placeholder={localeText.composerInputPlaceholder}
          {...(slotProps?.composerInput ?? {})}
        />
        <ComposerSendButtonComponent
          aria-label={localeText.composerSendButtonLabel}
          {...(slotProps?.composerSendButton ?? {})}
        >
          <DefaultSendIcon />
        </ComposerSendButtonComponent>
      </ComposerRootComponent>
    );
  }

  return (
    <ComposerRootComponent attachmentConfig={attachmentConfig} {...(slotProps?.composerRoot ?? {})}>
      {showAttachments && (
        <ComposerAttachmentListComponent {...(slotProps?.composerAttachmentList ?? {})} />
      )}
      <ComposerInputComponent
        placeholder={localeText.composerInputPlaceholder}
        {...(slotProps?.composerInput ?? {})}
      />
      {showHelperText && <ComposerHelperTextComponent {...(slotProps?.composerHelperText ?? {})} />}
      <ComposerToolbarComponent {...(slotProps?.composerToolbar ?? {})}>
        {showAttachments && (
          <ComposerAttachButtonComponent
            aria-label={localeText.composerAttachButtonLabel}
            {...(slotProps?.composerAttachButton ?? {})}
          >
            <DefaultAttachIcon />
          </ComposerAttachButtonComponent>
        )}
        <ComposerSendButtonComponent
          aria-label={localeText.composerSendButtonLabel}
          {...(slotProps?.composerSendButton ?? {})}
        >
          <DefaultSendIcon />
        </ComposerSendButtonComponent>
      </ComposerToolbarComponent>
    </ComposerRootComponent>
  );
}

export function ChatBoxContent(props: ChatBoxContentProps) {
  const {
    variant,
    slots,
    slotProps,
    features,
    rootRef,
    layoutClassName,
    conversationsPaneClassName,
    threadPaneClassName,
    suggestions,
    suggestionsAutoSubmit,
  } = props;
  const showScrollToBottom = features?.scrollToBottom !== false;
  const showSuggestions =
    features?.suggestions !== false && !!suggestions && suggestions.length > 0;

  const autoScrollProp = features?.autoScroll ?? true;

  const isNarrow = useContainerNarrow(rootRef);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const messageIds = useMessageIds();
  const conversations = useConversations();
  const localeText = useChatLocaleText();
  const hasConversationList = conversations.length > 0;

  const handleMenuClick = React.useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = React.useCallback(() => {
    setDrawerOpen(false);
  }, []);
  const ScrollToBottomComponent = (slots?.scrollToBottom ??
    ChatScrollToBottomAffordance) as typeof ChatScrollToBottomAffordance;
  const ConversationListComponent = (slots?.conversationList ??
    ChatConversationList) as typeof ChatConversationList;
  const MessageListComponent = (slots?.messageList ?? ChatMessageList) as typeof ChatMessageList;
  const SuggestionsComponent = (slots?.suggestions ?? ChatSuggestions) as typeof ChatSuggestions;

  // Use refs so renderItem is stable and doesn't cause the virtualized list
  // to re-render every time a new object reference is passed for slots/slotProps.
  const slotsRef = React.useRef(slots);
  const slotPropsRef = React.useRef(slotProps);
  const featuresRef = React.useRef(features);
  slotsRef.current = slots;
  slotPropsRef.current = slotProps;
  featuresRef.current = features;

  const renderItem = React.useCallback(
    ({ id }: { id: string; index: number }) => (
      <DefaultMessageItem
        key={id}
        id={id}
        slots={slotsRef.current}
        slotProps={slotPropsRef.current}
        features={featuresRef.current}
      />
    ),
    [],
  );

  return (
    <ChatLayout
      className={layoutClassName}
      style={{ flex: 1, minHeight: 0 }}
      slotProps={{
        conversationsPane: {
          ...(conversationsPaneClassName ? { className: conversationsPaneClassName } : {}),
          style: {},
        },
        threadPane: {
          ...(threadPaneClassName ? { className: threadPaneClassName } : {}),
          style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      {hasConversationList && (
        <ConversationListComponent variant={variant} {...(slotProps?.conversationList ?? {})} />
      )}

      {hasConversationList && isNarrow && (
        <Drawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          slotProps={{
            paper: {
              sx: {
                width: 'var(--ChatBox-conversationListWidth, 260px)',
                maxWidth: '80vw',
              },
            },
          }}
        >
          <ConversationListComponent
            variant={variant}
            {...(slotProps?.conversationList ?? {})}
            slotProps={{
              ...slotProps?.conversationList?.slotProps,
              item: (params: any) => {
                const externalSlotProps = slotProps?.conversationList?.slotProps?.item;
                const externalProps =
                  typeof externalSlotProps === 'function'
                    ? externalSlotProps(params)
                    : externalSlotProps;
                return {
                  ...externalProps,
                  onClick: (event: React.MouseEvent) => {
                    (externalProps as any)?.onClick?.(event);
                    handleDrawerClose();
                  },
                };
              },
            }}
          />
        </Drawer>
      )}

      <ChatConversation>
        <DefaultConversationHeader
          slots={slots}
          slotProps={slotProps}
          features={features}
          onMenuClick={handleMenuClick}
          showMenuButton={hasConversationList && isNarrow}
        />
        <MessageListComponent
          renderItem={renderItem}
          items={messageIds}
          autoScroll={autoScrollProp}
          overlay={
            <React.Fragment>
              {messageIds.length === 0 && !showSuggestions && (
                <ChatBoxEmptyState>
                  <ChatBoxEmptyStateIcon
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </ChatBoxEmptyStateIcon>
                  <ChatBoxEmptyStateTitle>
                    {localeText.threadNoMessagesLabel}
                  </ChatBoxEmptyStateTitle>
                  <ChatBoxEmptyStateHelper>
                    {localeText.threadNoMessagesHelperText}
                  </ChatBoxEmptyStateHelper>
                </ChatBoxEmptyState>
              )}
              {showSuggestions && messageIds.length === 0 && (
                <SuggestionsComponent
                  suggestions={suggestions}
                  autoSubmit={suggestionsAutoSubmit}
                  {...(slotProps?.suggestions ?? {})}
                />
              )}
              {showScrollToBottom && (
                <ScrollToBottomComponent {...(slotProps?.scrollToBottom ?? {})} />
              )}
            </React.Fragment>
          }
          {...(slotProps?.messageList ?? {})}
        />
        <DefaultComposer slots={slots} slotProps={slotProps} features={features} />
      </ChatConversation>
    </ChatLayout>
  );
}
