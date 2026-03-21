import { type ChatBoxClassKey } from '../ChatBox/chatBoxClasses';
import { type ChatMessageClassKey } from '../ChatMessage/chatMessageClasses';
import { type ChatMessageListClassKey } from '../ChatMessageList/chatMessageListClasses';
import { type ChatConversationClassKey } from '../ChatConversation/chatConversationClasses';
import { type ChatConversationInputClassKey } from '../ChatConversationInput/chatConversationInputClasses';
import { type ChatConversationListClassKey } from '../ChatConversationList/chatConversationListClasses';
import { type ChatIndicatorClassKey } from '../ChatIndicators/chatIndicatorClasses';

// prettier-ignore
export interface ChatComponentNameToClassKey {
  MuiChatBox: ChatBoxClassKey;
  MuiChatMessage: ChatMessageClassKey;
  MuiChatMessageList: ChatMessageListClassKey;
  MuiChatConversation: ChatConversationClassKey;
  MuiChatConversationInput: ChatConversationInputClassKey;
  MuiChatConversationList: ChatConversationListClassKey;
  MuiChatIndicator: ChatIndicatorClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChatComponentNameToClassKey {}
}

// disable automatic export
export {};
