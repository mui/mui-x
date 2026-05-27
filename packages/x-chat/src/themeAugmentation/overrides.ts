import { type ChatCodeBlockClassKey } from '../ChatCodeBlock/chatCodeBlockClasses';
import { type ChatConfirmationClassKey } from '../ChatConfirmation/chatConfirmationClasses';
import { type ChatBoxClassKey } from '../ChatBox/chatBoxClasses';
import { type ChatMessageClassKey } from '../ChatMessage/chatMessageClasses';
import { type ChatMessageListClassKey } from '../ChatMessageList/chatMessageListClasses';
import { type ChatConversationClassKey } from '../ChatConversation/chatConversationClasses';
import { type ChatComposerClassKey } from '../ChatComposer/chatComposerClasses';
import { type ChatConversationListClassKey } from '../ChatConversationList/chatConversationListClasses';
import { type ChatTypingIndicatorClassKey } from '../ChatIndicators/chatTypingIndicatorClasses';
import { type ChatScrollToBottomAffordanceClassKey } from '../ChatIndicators/chatScrollToBottomAffordanceClasses';
import { type ChatSuggestionsClassKey } from '../ChatSuggestions/chatSuggestionsClasses';
import { type ChatUnreadMarkerClassKey } from '../ChatIndicators/chatUnreadMarkerClasses';
import { type ChatMessageSourcesClassKey } from '../ChatMessageSources/chatMessageSourcesClasses';
import { type ChatMessageSourceClassKey } from '../ChatMessageSources/chatMessageSourceClasses';
import { type ChatMessageSkeletonClassKey } from '../ChatMessageSkeleton/chatMessageSkeletonClasses';

// prettier-ignore
export interface ChatComponentNameToClassKey {
  MuiChatCodeBlock: ChatCodeBlockClassKey;
  MuiChatConfirmation: ChatConfirmationClassKey;
  MuiChatBox: ChatBoxClassKey;
  MuiChatMessage: ChatMessageClassKey;
  MuiChatMessageList: ChatMessageListClassKey;
  MuiChatConversation: ChatConversationClassKey;
  MuiChatComposer: ChatComposerClassKey;
  MuiChatConversationList: ChatConversationListClassKey;
  MuiChatTypingIndicator: ChatTypingIndicatorClassKey;
  MuiChatScrollToBottomAffordance: ChatScrollToBottomAffordanceClassKey;
  MuiChatSuggestions: ChatSuggestionsClassKey;
  MuiChatUnreadMarker: ChatUnreadMarkerClassKey;
  MuiChatMessageSources: ChatMessageSourcesClassKey;
  MuiChatMessageSource: ChatMessageSourceClassKey;
  MuiChatMessageSkeleton: ChatMessageSkeletonClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChatComponentNameToClassKey {}
}

// disable automatic export
export {};
