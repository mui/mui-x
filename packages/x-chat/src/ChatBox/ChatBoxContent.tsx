'use client';
import * as React from 'react';
import { useMessageIds, useConversations } from '@mui/x-chat-headless';
import { styled } from '../internals/zero-styled';
import { ChatLayout, useChatLocaleText } from '@mui/x-chat-unstyled';
import { ChatConversation } from '../ChatConversation/ChatConversation';
import { ChatConversationHeader } from '../ChatConversation/ChatConversationHeader';
import { ChatConversationTitle } from '../ChatConversation/ChatConversationTitle';
import { ChatConversationSubtitle } from '../ChatConversation/ChatConversationSubtitle';
import { ChatConversationHeaderActions } from '../ChatConversation/ChatConversationHeaderActions';
import { ChatConversationList } from '../ChatConversationList/ChatConversationList';
import { ChatConversationInput } from '../ChatConversationInput/ChatConversationInput';
import { ChatConversationInputTextArea } from '../ChatConversationInput/ChatConversationInputTextArea';
import { ChatConversationInputSendButton } from '../ChatConversationInput/ChatConversationInputSendButton';
import { ChatConversationInputAttachButton } from '../ChatConversationInput/ChatConversationInputAttachButton';
import { ChatConversationInputToolbar } from '../ChatConversationInput/ChatConversationInputToolbar';
import { ChatConversationInputHelperText } from '../ChatConversationInput/ChatConversationInputHelperText';
import { ChatMessageList } from '../ChatMessageList/ChatMessageList';
import { ChatMessageGroup } from '../ChatMessage/ChatMessageGroup';
import { ChatMessageContent } from '../ChatMessage/ChatMessageContent';
import { ChatMessageMeta } from '../ChatMessage/ChatMessageMeta';
import { ChatMessageAvatar } from '../ChatMessage/ChatMessageAvatar';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatScrollToBottomAffordance } from '../ChatIndicators/ChatScrollToBottomAffordance';
import type { ChatBoxSlots, ChatBoxSlotProps, ChatBoxFeatures } from './ChatBox.types';

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
  slots?: Partial<ChatBoxSlots>;
  slotProps?: ChatBoxSlotProps;
  features?: ChatBoxFeatures;
  layoutClassName?: string;
  conversationsPaneClassName?: string;
  threadPaneClassName?: string;
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
  const ConversationTitleComponent = (slots?.conversationTitle ??
    ChatConversationTitle) as typeof ChatConversationTitle;
  const ConversationSubtitleComponent = (slots?.conversationSubtitle ??
    ChatConversationSubtitle) as typeof ChatConversationSubtitle;
  const ConversationHeaderActionsComponent = (slots?.conversationHeaderActions ??
    ChatConversationHeaderActions) as typeof ChatConversationHeaderActions;

  return (
    <ConversationHeaderComponent {...(slotProps?.conversationHeader ?? {})}>
      <ConversationTitleComponent {...(slotProps?.conversationTitle ?? {})} />
      <ConversationSubtitleComponent {...(slotProps?.conversationSubtitle ?? {})} />
      <ConversationHeaderActionsComponent {...(slotProps?.conversationHeaderActions ?? {})} />
    </ConversationHeaderComponent>
  );
}

function DefaultSendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function DefaultAttachIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
    </svg>
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
  const showAttachButton = features?.attachButton !== false;
  const showHelperText = features?.helperText !== false;
  const ComposerRootComponent = (slots?.composerRoot ??
    ChatConversationInput) as typeof ChatConversationInput;
  const ComposerInputComponent = (slots?.composerInput ??
    ChatConversationInputTextArea) as typeof ChatConversationInputTextArea;
  const ComposerToolbarComponent = (slots?.composerToolbar ??
    ChatConversationInputToolbar) as typeof ChatConversationInputToolbar;
  const ComposerSendButtonComponent = (slots?.composerSendButton ??
    ChatConversationInputSendButton) as typeof ChatConversationInputSendButton;
  const ComposerAttachButtonComponent = (slots?.composerAttachButton ??
    ChatConversationInputAttachButton) as typeof ChatConversationInputAttachButton;
  const ComposerHelperTextComponent = (slots?.composerHelperText ??
    ChatConversationInputHelperText) as typeof ChatConversationInputHelperText;
  const localeText = useChatLocaleText();

  return (
    <ComposerRootComponent {...(slotProps?.composerRoot ?? {})}>
      <ComposerInputComponent placeholder={localeText.composerInputPlaceholder} {...(slotProps?.composerInput ?? {})} />
      {showHelperText && <ComposerHelperTextComponent {...(slotProps?.composerHelperText ?? {})} />}
      <ComposerToolbarComponent {...(slotProps?.composerToolbar ?? {})}>
        {showAttachButton && (
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
    slots,
    slotProps,
    features,
    layoutClassName,
    conversationsPaneClassName,
    threadPaneClassName,
  } = props;
  const showScrollToBottom = features?.scrollToBottom !== false;

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
        <ConversationListComponent {...(slotProps?.conversationList ?? {})} />
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
