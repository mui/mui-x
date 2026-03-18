'use client';
import type { ChatMessageStatus, ChatToolInvocationState, ChatUser } from '@mui/x-chat-headless';

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
  messageReasoningStreamingLabel: string;
  messageToolInputLabel: string;
  messageToolOutputLabel: string;
  messageToolApproveButtonLabel: string;
  messageToolDenyButtonLabel: string;
  conversationListNoConversationsLabel: string;
  conversationListSearchPlaceholder: string;
  unreadMarkerLabel: string;
  retryButtonLabel: string;
  reconnectButtonLabel: string;
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

function getUserLabel(user: ChatLocaleTypingUser) {
  return user.displayName ?? user.id;
}

const messageStatusLabels: Record<ChatMessageStatus, string> = {
  pending: 'Pending',
  sending: 'Sending',
  streaming: 'Streaming',
  sent: 'Sent',
  error: 'Error',
  cancelled: 'Cancelled',
};

const toolStateLabels: Record<ChatToolInvocationState, string> = {
  'input-streaming': 'Running...',
  'input-available': 'Running...',
  'approval-requested': 'Awaiting approval',
  'approval-responded': 'Running...',
  'output-available': 'Completed',
  'output-error': 'Failed',
  'output-denied': 'Denied',
};

export const CHAT_DEFAULT_LOCALE_TEXT: ChatLocaleText = {
  composerInputPlaceholder: 'Type a message',
  composerInputAriaLabel: 'Message',
  composerSendButtonLabel: 'Send message',
  composerAttachButtonLabel: 'Add attachment',
  messageCopyCodeButtonLabel: 'Copy code',
  messageCopiedCodeButtonLabel: 'Copied',
  messageEditedLabel: 'Edited',
  messageDeletedLabel: 'Deleted',
  messageReasoningLabel: 'Reasoning',
  messageReasoningStreamingLabel: 'Thinking...',
  messageToolInputLabel: 'Input',
  messageToolOutputLabel: 'Output',
  messageToolApproveButtonLabel: 'Approve',
  messageToolDenyButtonLabel: 'Deny',
  conversationListNoConversationsLabel: 'No conversations',
  conversationListSearchPlaceholder: 'Search conversations',
  unreadMarkerLabel: 'New messages',
  retryButtonLabel: 'Retry',
  reconnectButtonLabel: 'Reconnect',
  scrollToBottomLabel: 'Scroll to bottom',
  threadNoMessagesLabel: 'No messages yet',
  genericErrorLabel: 'Something went wrong',
  loadingLabel: 'Loading...',
  messageStatusLabel: (status) => messageStatusLabels[status],
  toolStateLabel: (state) => toolStateLabels[state],
  messageTimestampLabel: (dateTime) => dateTime,
  conversationTimestampLabel: (dateTime) => dateTime,
  typingIndicatorLabel: (users) => {
    const names = users.map(getUserLabel).join(', ');

    if (users.length === 1) {
      return `${names} is typing`;
    }

    return `${names} are typing`;
  },
  scrollToBottomWithCountLabel: (unseenCount) => `Scroll to bottom, ${unseenCount} new messages`,
};
