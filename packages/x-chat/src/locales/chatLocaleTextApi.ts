import type {
  ChatMessageStatus,
  ChatToolInvocationState,
  ChatUser,
} from '@mui/x-chat-headless';

export type ChatLocaleTypingUser = Pick<ChatUser, 'id' | 'displayName'>;

export interface ChatLocaleText {
  composerInputPlaceholder: string;
  composerInputAriaLabel: string;
  composerSendButtonLabel: string;
  composerAttachButtonLabel: string;
  messageCopyCodeButtonLabel: string;
  messageCopiedCodeButtonLabel: string;
  messageEditedLabel: string;
  messageDeletedLabel: string;
  messageReasoningLabel: string;
  conversationListNoConversationsLabel: string;
  conversationListSearchPlaceholder: string;
  unreadMarkerLabel: string;
  scrollToBottomLabel: string;
  threadNoMessagesLabel: string;
  genericErrorLabel: string;
  loadingLabel: string;
  messageStatusLabel(status: ChatMessageStatus): string;
  toolStateLabel(state: ChatToolInvocationState): string;
  messageTimestampLabel(dateTime: string): string;
  conversationTimestampLabel(dateTime: string): string;
  typingIndicatorLabel(users: ChatLocaleTypingUser[]): string;
  scrollToBottomWithCountLabel(unseenCount: number): string;
}

export interface ChatLocalization {
  components: {
    MuiChatBox: {
      defaultProps: {
        localeText: Partial<ChatLocaleText>;
      };
    };
  };
}
