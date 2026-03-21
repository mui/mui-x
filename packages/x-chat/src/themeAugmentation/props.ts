import { type ChatBoxProps } from '../ChatBox/ChatBox.types';
import { type ChatMessageProps } from '../ChatMessage/ChatMessage';
import { type ChatMessageListProps } from '../ChatMessageList/ChatMessageList';
import { type ChatConversationProps } from '../ChatConversation/ChatConversation';
import { type ChatConversationInputProps } from '../ChatConversationInput/ChatConversationInput';
import { type ChatConversationListProps } from '../ChatConversationList/ChatConversationList';
import { type ChatTypingIndicatorProps } from '../ChatIndicators/ChatTypingIndicator';

export interface ChatComponentsPropsList {
  MuiChatBox: ChatBoxProps<any>;
  MuiChatMessage: ChatMessageProps;
  MuiChatMessageList: ChatMessageListProps;
  MuiChatConversation: ChatConversationProps;
  MuiChatConversationInput: ChatConversationInputProps;
  MuiChatConversationList: ChatConversationListProps;
  MuiChatIndicator: ChatTypingIndicatorProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChatComponentsPropsList {}
}

// disable automatic export
export {};
