'use client';
import * as React from 'react';
import { useMessage, useMessageIds, useConversations } from '@mui/x-chat-headless';
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
import DefaultNewChatIcon from '../icons/DefaultNewChatIcon';
import DefaultSettingsIcon from '../icons/DefaultSettingsIcon';

const ChatBoxEmptyState = styled('div', {
  name: 'MuiChatBox',
  slot: 'EmptyState',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: (theme.vars || theme).palette.text.secondary,
  ...theme.typography.body2,
  padding: theme.spacing(4),
  userSelect: 'none',
  pointerEvents: 'none',
}));

interface ChatBoxContentProps {
  variant?: ChatVariant;
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
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
  const inlineMeta =
    isDefault && !isStreaming && hasMeta ? <ChatMessageInlineMeta /> : undefined;

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
}: {
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
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
      <ConversationHeaderInfoComponent {...(slotProps?.conversationHeaderInfo ?? {})}>
        <ConversationTitleComponent {...(slotProps?.conversationTitle ?? {})} />
        <ConversationSubtitleComponent {...(slotProps?.conversationSubtitle ?? {})} />
      </ConversationHeaderInfoComponent>
      <ConversationHeaderActionsComponent {...(slotProps?.conversationHeaderActions ?? {})}>
        <Tooltip title={localeText.conversationHeaderNewChatLabel}>
          <IconButton size="small" aria-label={localeText.conversationHeaderNewChatLabel}>
            <DefaultNewChatIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={localeText.conversationHeaderSettingsLabel}>
          <IconButton size="small" aria-label={localeText.conversationHeaderSettingsLabel}>
            <DefaultSettingsIcon />
          </IconButton>
        </Tooltip>
      </ConversationHeaderActionsComponent>
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

  const messageIds = useMessageIds();
  const conversations = useConversations();
  const localeText = useChatLocaleText();
  const hasConversationList = conversations.length > 0;
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
          style: { flexShrink: 0 },
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

      <ChatConversation>
        <DefaultConversationHeader slots={slots} slotProps={slotProps} features={features} />
        <MessageListComponent
          renderItem={renderItem}
          items={messageIds}
          autoScroll={autoScrollProp}
          overlay={
            <React.Fragment>
              {messageIds.length === 0 && !showSuggestions && (
                <ChatBoxEmptyState>{localeText.threadNoMessagesLabel}</ChatBoxEmptyState>
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
