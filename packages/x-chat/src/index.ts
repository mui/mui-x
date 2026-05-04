// ─── Top-level ChatBox (one-liner) ───────────────────────────────────────────
export { ChatBox } from './ChatBox/ChatBox';
export type {
  ChatBoxProps,
  ChatBoxSlots,
  ChatBoxSlotProps,
  ChatBoxFeatures,
  ChatBoxLayoutMode,
  ChatBoxLayoutModeBreakpoints,
} from './ChatBox/ChatBox.types';
export type { ChatVariant, ChatDensity } from '@mui/x-chat-headless';
export type {
  ChatAttachmentRejection,
  ChatAttachmentRejectionReason,
  ChatAttachmentsConfig,
} from '@mui/x-chat-headless';
export { chatBoxClasses, getChatBoxUtilityClass } from './ChatBox/chatBoxClasses';
export type { ChatBoxClasses, ChatBoxClassKey } from './ChatBox/chatBoxClasses';

// ─── ChatCodeBlock ────────────────────────────────────────────────────────────
export { ChatCodeBlock } from './ChatCodeBlock/ChatCodeBlock';
export type { ChatCodeBlockProps } from './ChatCodeBlock/ChatCodeBlock';
export {
  chatCodeBlockClasses,
  getChatCodeBlockUtilityClass,
} from './ChatCodeBlock/chatCodeBlockClasses';
export type {
  ChatCodeBlockClasses,
  ChatCodeBlockClassKey,
} from './ChatCodeBlock/chatCodeBlockClasses';

// ─── ChatConfirmation ─────────────────────────────────────────────────────────
export { ChatConfirmation } from './ChatConfirmation/ChatConfirmation';
export type { ChatConfirmationProps } from './ChatConfirmation/ChatConfirmation';
export {
  chatConfirmationClasses,
  getChatConfirmationUtilityClass,
} from './ChatConfirmation/chatConfirmationClasses';
export type {
  ChatConfirmationClasses,
  ChatConfirmationClassKey,
} from './ChatConfirmation/chatConfirmationClasses';

// ─── ChatConversation ─────────────────────────────────────────────────────────
export { ChatConversation } from './ChatConversation/ChatConversation';
export type { ChatConversationProps } from './ChatConversation/ChatConversation';
export { ChatConversationHeader } from './ChatConversation/ChatConversationHeader';
export type { ChatConversationHeaderProps } from './ChatConversation/ChatConversationHeader';
export { ChatConversationTitle } from './ChatConversation/ChatConversationTitle';
export type { ChatConversationTitleProps } from './ChatConversation/ChatConversationTitle';
export { ChatConversationSubtitle } from './ChatConversation/ChatConversationSubtitle';
export type { ChatConversationSubtitleProps } from './ChatConversation/ChatConversationSubtitle';
export { ChatConversationHeaderInfo } from './ChatConversation/ChatConversationHeaderInfo';
export type { ChatConversationHeaderInfoProps } from './ChatConversation/ChatConversationHeaderInfo';
export { ChatConversationHeaderActions } from './ChatConversation/ChatConversationHeaderActions';
export type { ChatConversationHeaderActionsProps } from './ChatConversation/ChatConversationHeaderActions';
export {
  chatConversationClasses,
  getChatConversationUtilityClass,
} from './ChatConversation/chatConversationClasses';
export type {
  ChatConversationClasses,
  ChatConversationClassKey,
} from './ChatConversation/chatConversationClasses';

// ─── ChatComposer ────────────────────────────────────────────────────
export { ChatComposer } from './ChatComposer/ChatComposer';
export type { ChatComposerProps, ChatComposerFeatures } from './ChatComposer/ChatComposer';
export { ChatComposerTextArea } from './ChatComposer/ChatComposerTextArea';
export type { ChatComposerTextAreaProps } from './ChatComposer/ChatComposerTextArea';
export { ChatComposerSendButton } from './ChatComposer/ChatComposerSendButton';
export type { ChatComposerSendButtonProps } from './ChatComposer/ChatComposerSendButton';
export { ChatComposerAttachButton } from './ChatComposer/ChatComposerAttachButton';
export type { ChatComposerAttachButtonProps } from './ChatComposer/ChatComposerAttachButton';
export { ChatComposerAttachmentList } from './ChatComposer/ChatComposerAttachmentList';
export type { ChatComposerAttachmentListProps } from './ChatComposer/ChatComposerAttachmentList';
export { ChatComposerToolbar } from './ChatComposer/ChatComposerToolbar';
export type { ChatComposerToolbarProps } from './ChatComposer/ChatComposerToolbar';
export { ChatComposerHelperText } from './ChatComposer/ChatComposerHelperText';
export type { ChatComposerHelperTextProps } from './ChatComposer/ChatComposerHelperText';
export { ChatComposerLabel } from './ChatComposer/ChatComposerLabel';
export {
  chatComposerClasses,
  getChatComposerUtilityClass,
} from './ChatComposer/chatComposerClasses';
export type { ChatComposerClasses, ChatComposerClassKey } from './ChatComposer/chatComposerClasses';

// ─── ChatConversationList ─────────────────────────────────────────────────────
export { ChatConversationList } from './ChatConversationList/ChatConversationList';
export type { ChatConversationListProps } from './ChatConversationList/ChatConversationList';
export {
  chatConversationListClasses,
  getChatConversationListUtilityClass,
} from './ChatConversationList/chatConversationListClasses';
export type {
  ChatConversationListClasses,
  ChatConversationListClassKey,
} from './ChatConversationList/chatConversationListClasses';

// ─── ChatMessage ──────────────────────────────────────────────────────────────
export { ChatMessage } from './ChatMessage/ChatMessage';
export type { ChatMessageProps } from './ChatMessage/ChatMessage';
export { ChatMessageAvatar } from './ChatMessage/ChatMessageAvatar';
export type { ChatMessageAvatarProps } from './ChatMessage/ChatMessageAvatar';
export { ChatMessageAuthorLabel } from './ChatMessage/ChatMessageAuthorLabel';
export type { ChatMessageAuthorLabelProps } from './ChatMessage/ChatMessageAuthorLabel';
export { ChatMessageContent } from './ChatMessage/ChatMessageContent';
export type { ChatMessageContentProps } from './ChatMessage/ChatMessageContent';
export { ChatMessageMeta } from './ChatMessage/ChatMessageMeta';
export type { ChatMessageMetaProps } from './ChatMessage/ChatMessageMeta';
export { ChatMessageInlineMeta } from './ChatMessage/ChatMessageInlineMeta';
export { ChatMessageActions } from './ChatMessage/ChatMessageActions';
export type { ChatMessageActionsProps } from './ChatMessage/ChatMessageActions';
export { ChatMessageGroup } from './ChatMessage/ChatMessageGroup';
export type { ChatMessageGroupProps } from './ChatMessage/ChatMessageGroup';
export { ChatDateDivider } from './ChatMessage/ChatDateDivider';
export type { ChatDateDividerProps } from './ChatMessage/ChatDateDivider';
export { chatMessageClasses, getChatMessageUtilityClass } from './ChatMessage/chatMessageClasses';
export type { ChatMessageClasses, ChatMessageClassKey } from './ChatMessage/chatMessageClasses';

// ─── ChatMessageError ─────────────────────────────────────────────────────────
export { ChatMessageError } from './ChatMessageError/ChatMessageError';
export type { ChatMessageErrorProps } from './ChatMessageError/ChatMessageError';
export {
  chatMessageErrorClasses,
  getChatMessageErrorUtilityClass,
} from './ChatMessageError/chatMessageErrorClasses';
export type {
  ChatMessageErrorClasses,
  ChatMessageErrorClassKey,
} from './ChatMessageError/chatMessageErrorClasses';

// ─── ChatMessageList ──────────────────────────────────────────────────────────
export { ChatMessageList } from './ChatMessageList/ChatMessageList';
export type { ChatMessageListProps } from './ChatMessageList/ChatMessageList';
export {
  chatMessageListClasses,
  getChatMessageListUtilityClass,
} from './ChatMessageList/chatMessageListClasses';
export type {
  ChatMessageListClasses,
  ChatMessageListClassKey,
} from './ChatMessageList/chatMessageListClasses';

// ─── ChatSuggestions ─────────────────────────────────────────────────────────
export { ChatSuggestions } from './ChatSuggestions/ChatSuggestions';
export type { ChatSuggestionsProps } from './ChatSuggestions/ChatSuggestions';
export {
  chatSuggestionsClasses,
  getChatSuggestionsUtilityClass,
} from './ChatSuggestions/chatSuggestionsClasses';
export type {
  ChatSuggestionsClasses,
  ChatSuggestionsClassKey,
} from './ChatSuggestions/chatSuggestionsClasses';

// ─── ChatMessageSources ───────────────────────────────────────────────────────
export { ChatMessageSources } from './ChatMessageSources/ChatMessageSources';
export type {
  ChatMessageSourcesProps,
  ChatMessageSourcesSlots,
  ChatMessageSourcesSlotProps,
} from './ChatMessageSources/ChatMessageSources';
export { ChatMessageSource } from './ChatMessageSources/ChatMessageSource';
export type {
  ChatMessageSourceProps,
  ChatMessageSourceSlots,
  ChatMessageSourceSlotProps,
} from './ChatMessageSources/ChatMessageSource';
export {
  chatMessageSourcesClasses,
  getChatMessageSourcesUtilityClass,
} from './ChatMessageSources/chatMessageSourcesClasses';
export type {
  ChatMessageSourcesClasses,
  ChatMessageSourcesClassKey,
} from './ChatMessageSources/chatMessageSourcesClasses';
export {
  chatMessageSourceClasses,
  getChatMessageSourceUtilityClass,
} from './ChatMessageSources/chatMessageSourceClasses';
export type {
  ChatMessageSourceClasses,
  ChatMessageSourceClassKey,
} from './ChatMessageSources/chatMessageSourceClasses';

// ─── ChatMessageSkeleton ──────────────────────────────────────────────────────
export { ChatMessageSkeleton } from './ChatMessageSkeleton';
export type {
  ChatMessageSkeletonProps,
  ChatMessageSkeletonSlots,
  ChatMessageSkeletonSlotProps,
} from './ChatMessageSkeleton';
export {
  chatMessageSkeletonClasses,
  getChatMessageSkeletonUtilityClass,
} from './ChatMessageSkeleton';
export type {
  ChatMessageSkeletonClasses,
  ChatMessageSkeletonClassKey,
} from './ChatMessageSkeleton';

// ─── ChatIndicators ───────────────────────────────────────────────────────────
export { ChatTypingIndicator } from './ChatIndicators/ChatTypingIndicator';
export type { ChatTypingIndicatorProps } from './ChatIndicators/ChatTypingIndicator';
export { ChatUnreadMarker } from './ChatIndicators/ChatUnreadMarker';
export type { ChatUnreadMarkerProps } from './ChatIndicators/ChatUnreadMarker';
export { ChatScrollToBottomAffordance } from './ChatIndicators/ChatScrollToBottomAffordance';
export type { ChatScrollToBottomAffordanceProps } from './ChatIndicators/ChatScrollToBottomAffordance';
export {
  chatTypingIndicatorClasses,
  getChatTypingIndicatorUtilityClass,
} from './ChatIndicators/chatTypingIndicatorClasses';
export type {
  ChatTypingIndicatorClasses,
  ChatTypingIndicatorClassKey,
} from './ChatIndicators/chatTypingIndicatorClasses';
export {
  chatScrollToBottomAffordanceClasses,
  getChatScrollToBottomAffordanceUtilityClass,
} from './ChatIndicators/chatScrollToBottomAffordanceClasses';
export type {
  ChatScrollToBottomAffordanceClasses,
  ChatScrollToBottomAffordanceClassKey,
} from './ChatIndicators/chatScrollToBottomAffordanceClasses';
export {
  chatUnreadMarkerClasses,
  getChatUnreadMarkerUtilityClass,
} from './ChatIndicators/chatUnreadMarkerClasses';
export type {
  ChatUnreadMarkerClasses,
  ChatUnreadMarkerClassKey,
} from './ChatIndicators/chatUnreadMarkerClasses';
