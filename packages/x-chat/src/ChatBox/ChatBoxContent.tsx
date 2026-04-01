'use client';
import * as React from 'react';
import { useMessageIds, useConversations } from '@mui/x-chat-headless';
import IconButton from '@mui/material/IconButton';
import { ChatLayout, useChatLocaleText, type ChatSuggestion, type ChatVariant } from '@mui/x-chat-unstyled';
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
  color: (theme.vars || theme).palette.text.disabled,
  fontSize: theme.typography.body2.fontSize,
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
}) {
  const MessageGroupComponent = (slots?.messageGroup ??
    ChatMessageGroup) as typeof ChatMessageGroup;
  const MessageAvatarComponent = (slots?.messageAvatar ??
    ChatMessageAvatar) as typeof ChatMessageAvatar;
  const MessageContentComponent = (slots?.messageContent ??
    ChatMessageContent) as typeof ChatMessageContent;
  const MessageMetaComponent = (slots?.messageMeta ?? ChatMessageMeta) as typeof ChatMessageMeta;
  const MessageRootComponent = (slots?.messageRoot ?? ChatMessage) as typeof ChatMessage;

  return (
    <MessageGroupComponent messageId={id} {...(slotProps?.messageGroup ?? {})}>
      <MessageRootComponent messageId={id} {...(slotProps?.messageRoot ?? {})}>
        <MessageAvatarComponent {...(slotProps?.messageAvatar ?? {})} />
        <MessageContentComponent {...(slotProps?.messageContent ?? {})} />
        <MessageMetaComponent {...(slotProps?.messageMeta ?? {})} />
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
        <IconButton size="small" aria-label="New chat">
          <DefaultNewChatIcon />
        </IconButton>
        <IconButton size="small" aria-label="Settings">
          <DefaultSettingsIcon />
        </IconButton>
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
  const showAttachments = features?.attachments !== false;
  const showHelperText = features?.helperText !== false;
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

  return (
    <ComposerRootComponent {...(slotProps?.composerRoot ?? {})}>
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
  slotsRef.current = slots;
  slotPropsRef.current = slotProps;

  const renderItem = React.useCallback(
    ({ id }: { id: string; index: number }) => (
      <DefaultMessageItem
        key={id}
        id={id}
        slots={slotsRef.current}
        slotProps={slotPropsRef.current}
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
              {messageIds.length === 0 && (
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
