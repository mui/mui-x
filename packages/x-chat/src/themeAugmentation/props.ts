import { type ChatCodeBlockProps } from '../ChatCodeBlock/ChatCodeBlock';
import { type ChatConfirmationProps } from '../ChatConfirmation/ChatConfirmation';
import { type ChatBoxProps } from '../ChatBox/ChatBox.types';
import { type ChatMessageProps } from '../ChatMessage/ChatMessage';
import { type ChatMessageListProps } from '../ChatMessageList/ChatMessageList';
import { type ChatConversationProps } from '../ChatConversation/ChatConversation';
import { type ChatConversationInputProps } from '../ChatConversationInput/ChatConversationInput';
import { type ChatConversationListProps } from '../ChatConversationList/ChatConversationList';
import { type ChatTypingIndicatorProps } from '../ChatIndicators/ChatTypingIndicator';
import { type ChatScrollToBottomAffordanceProps } from '../ChatIndicators/ChatScrollToBottomAffordance';
import { type ChatSuggestionsProps } from '../ChatSuggestions/ChatSuggestions';
import { type ChatUnreadMarkerProps } from '../ChatIndicators/ChatUnreadMarker';
import { type ChatMessageSourcesProps } from '../ChatMessageSources/ChatMessageSources';
import { type ChatMessageSourceProps } from '../ChatMessageSources/ChatMessageSource';
import { type ChatMessageSkeletonProps } from '../ChatMessageSkeleton/ChatMessageSkeleton';

export interface ChatComponentsPropsList {
  MuiChatCodeBlock: ChatCodeBlockProps;
  MuiChatConfirmation: ChatConfirmationProps;
  MuiChatBox: ChatBoxProps<any>;
  MuiChatMessage: ChatMessageProps;
  MuiChatMessageList: ChatMessageListProps;
  MuiChatConversation: ChatConversationProps;
  MuiChatConversationInput: ChatConversationInputProps;
  MuiChatConversationList: ChatConversationListProps;
  MuiChatTypingIndicator: ChatTypingIndicatorProps;
  MuiChatScrollToBottomAffordance: ChatScrollToBottomAffordanceProps;
  MuiChatSuggestions: ChatSuggestionsProps;
  MuiChatUnreadMarker: ChatUnreadMarkerProps;
  MuiChatMessageSources: ChatMessageSourcesProps;
  MuiChatMessageSource: ChatMessageSourceProps;
  MuiChatMessageSkeleton: ChatMessageSkeletonProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChatComponentsPropsList {}
}

// disable automatic export
export {};
