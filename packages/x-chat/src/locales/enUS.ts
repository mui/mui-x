import {
  getChatLocalization,
} from './getChatLocalization';
import type {
  ChatLocaleText,
  ChatLocaleTypingUser,
} from './chatLocaleTextApi';

function getUserLabel(user: ChatLocaleTypingUser) {
  return user.displayName ?? user.id;
}

const enUSLocaleText: ChatLocaleText = {
  composerInputPlaceholder: 'Type a message',
  composerInputAriaLabel: 'Message',
  composerSendButtonLabel: 'Send message',
  composerAttachButtonLabel: 'Add attachment',
  messageCopyCodeButtonLabel: 'Copy code',
  messageCopiedCodeButtonLabel: 'Copied',
  messageEditedLabel: 'Edited',
  messageDeletedLabel: 'Deleted',
  messageReasoningLabel: 'Reasoning',
  conversationListNoConversationsLabel: 'No conversations',
  conversationListSearchPlaceholder: 'Search conversations',
  unreadMarkerLabel: 'New messages',
  scrollToBottomLabel: 'Scroll to bottom',
  threadNoMessagesLabel: 'No messages yet',
  genericErrorLabel: 'Something went wrong',
  loadingLabel: 'Loading...',
  messageStatusLabel: (status) =>
    ({
      pending: 'Pending',
      sending: 'Sending',
      streaming: 'Streaming',
      sent: 'Sent',
      error: 'Error',
      cancelled: 'Cancelled',
    })[status],
  toolStateLabel: (state) =>
    ({
      'input-streaming': 'Running...',
      'input-available': 'Running...',
      'approval-requested': 'Awaiting approval',
      'approval-responded': 'Running...',
      'output-available': 'Completed',
      'output-error': 'Failed',
      'output-denied': 'Denied',
    })[state],
  messageTimestampLabel: (dateTime) => dateTime,
  conversationTimestampLabel: (dateTime) => dateTime,
  typingIndicatorLabel: (users) => {
    const names = users.map(getUserLabel).join(', ');

    if (users.length === 1) {
      return `${names} is typing`;
    }

    return `${names} are typing`;
  },
  scrollToBottomWithCountLabel: (unseenCount) =>
    `Scroll to bottom, ${unseenCount} new messages`,
};

export const enUS = getChatLocalization(enUSLocaleText);
