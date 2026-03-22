import { type ChatBoxClassKey } from '../ChatBox/chatBoxClasses';
import { type ChatMessageClassKey } from '../ChatMessage/chatMessageClasses';
import { type ChatMessageListClassKey } from '../ChatMessageList/chatMessageListClasses';
import { type ChatConversationClassKey } from '../ChatConversation/chatConversationClasses';
import { type ChatConversationInputClassKey } from '../ChatConversationInput/chatConversationInputClasses';
import { type ChatConversationListClassKey } from '../ChatConversationList/chatConversationListClasses';
import { type ChatTypingIndicatorClassKey } from '../ChatIndicators/chatTypingIndicatorClasses';
import { type ChatScrollToBottomAffordanceClassKey } from '../ChatIndicators/chatScrollToBottomAffordanceClasses';
import { type ChatUnreadMarkerClassKey } from '../ChatIndicators/chatUnreadMarkerClasses';

// prettier-ignore
export interface ChatComponentNameToClassKey {
  MuiChatBox: ChatBoxClassKey;
  MuiChatMessage: ChatMessageClassKey;
  MuiChatMessageList: ChatMessageListClassKey;
  MuiChatConversation: ChatConversationClassKey;
  MuiChatConversationInput: ChatConversationInputClassKey;
  MuiChatConversationList: ChatConversationListClassKey;
  MuiChatTypingIndicator: ChatTypingIndicatorClassKey;
  MuiChatScrollToBottomAffordance: ChatScrollToBottomAffordanceClassKey;
  MuiChatUnreadMarker: ChatUnreadMarkerClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChatComponentNameToClassKey {}
}

// disable automatic export
export {};
