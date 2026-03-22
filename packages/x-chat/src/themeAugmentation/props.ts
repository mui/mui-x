import { type ChatBoxProps } from '../ChatBox/ChatBox.types';
import { type ChatMessageProps } from '../ChatMessage/ChatMessage';
import { type ChatMessageListProps } from '../ChatMessageList/ChatMessageList';
import { type ChatConversationProps } from '../ChatConversation/ChatConversation';
import { type ChatConversationInputProps } from '../ChatConversationInput/ChatConversationInput';
import { type ChatConversationListProps } from '../ChatConversationList/ChatConversationList';
import { type ChatTypingIndicatorProps } from '../ChatIndicators/ChatTypingIndicator';
import { type ChatScrollToBottomAffordanceProps } from '../ChatIndicators/ChatScrollToBottomAffordance';
import { type ChatUnreadMarkerProps } from '../ChatIndicators/ChatUnreadMarker';

export interface ChatComponentsPropsList {
  MuiChatBox: ChatBoxProps<any>;
  MuiChatMessage: ChatMessageProps;
  MuiChatMessageList: ChatMessageListProps;
  MuiChatConversation: ChatConversationProps;
  MuiChatConversationInput: ChatConversationInputProps;
  MuiChatConversationList: ChatConversationListProps;
  MuiChatTypingIndicator: ChatTypingIndicatorProps;
  MuiChatScrollToBottomAffordance: ChatScrollToBottomAffordanceProps;
  MuiChatUnreadMarker: ChatUnreadMarkerProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChatComponentsPropsList {}
}

// disable automatic export
export {};
