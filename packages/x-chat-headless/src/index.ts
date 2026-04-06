// Local imports for the namespace convenience objects below.
import { ChatLayout, ChatRoot } from './chat';
import {
  ConversationHeader,
  ConversationHeaderActions,
  ConversationRoot,
  ConversationSubtitle,
  ConversationTitle,
} from './conversation';
import {
  ComposerAttachButton,
  ComposerAttachmentList,
  ComposerHelperText,
  ComposerRoot,
  ComposerSendButton,
  ComposerTextArea,
  ComposerToolbar,
} from './composer';
import { ConversationListRoot } from './conversation-list';
import { ScrollToBottomAffordance, TypingIndicator, UnreadMarker } from './indicators';
import {
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageMeta,
  MessageRoot,
} from './message';
import { MessageListDateDivider, MessageListRoot } from './message-list';

// Core logic exports
export { ChatProvider } from './ChatProvider';

export { useChat } from './hooks/useChat';
export { useChatComposer } from './hooks/useChatComposer';
export { useChatOnToolCall } from './hooks/useChatOnToolCall';
export { useChatPartRenderer } from './hooks/useChatPartRenderer';
export { useChatStatus } from './hooks/useChatStatus';
export { useChatStore } from './hooks/useChatStore';
export { useConversation, useConversations } from './hooks/useConversation';
export { useMessage, useMessageIds } from './hooks/useMessage';

export {
  chatSelectors,
  selectMessageIds,
  selectMessagesById,
  selectConversationIds,
  selectConversationsById,
  selectActiveConversationId,
  selectIsStreaming,
  selectHasMoreHistory,
  selectError,
  selectMessages,
  selectMessage,
  selectConversations,
  selectConversation,
  selectActiveConversation,
  selectMessageCount,
  selectConversationCount,
  selectComposerValue,
  selectComposerAttachments,
  selectTypingUserIds,
} from './selectors/chatSelectors';

export type { ChatProviderProps } from './ChatProvider';

export type { ChatAdapter, PaginationDirection } from './adapters/chatAdapter';

export type {
  ChatPartRenderer,
  ChatPartRendererMap,
  ChatPartRendererProps,
} from './renderers/chatPartRenderer';

export type {
  ChatAddToolApproveResponseInput,
  ChatOnData,
  ChatOnFinish,
  ChatOnFinishPayload,
  ChatOnToolCall,
  ChatOnToolCallPayload,
  UseChatSendMessageInput,
} from './types/chat-callbacks';

export type {
  ChatAttachmentRejection,
  ChatAttachmentRejectionReason,
  ChatAttachmentsConfig,
  ChatConversation,
  ChatDateTimeString,
  ChatDraftAttachment,
  ChatDraftAttachmentStatus,
  ChatMessage,
  ChatMessageStatus,
  ChatRole,
  ChatUser,
  ConversationReadState,
} from './types/chat-entities';

export type { ChatError, ChatErrorCode } from './types/chat-error';

export type {
  ChatBuiltInMessagePart,
  ChatCustomMessagePart,
  ChatDataMessagePart,
  ChatDataPartType,
  ChatDynamicToolInvocation,
  ChatDynamicToolMessagePart,
  ChatFileMessagePart,
  ChatMessagePart,
  ChatMessagePartStatus,
  ChatReasoningMessagePart,
  ChatSourceDocumentMessagePart,
  ChatSourceUrlMessagePart,
  ChatStepStartMessagePart,
  ChatTextMessagePart,
  ChatToolApproval,
  ChatToolInvocation,
  ChatToolInvocationState,
  ChatToolMessagePart,
} from './types/chat-message-parts';

export type { ChatRealtimeEvent } from './types/chat-realtime';

export type { ChatPublicState } from './types/chat-state';

export type { ChatMessageChunk, ChatStreamEnvelope } from './types/chat-stream';

export { ChatStreamError } from './stream/ChatStreamError';


// Headless component exports (structural primitives without styling)
// Using direct re-exports so the API docs builder can resolve component symbols correctly.
export {
  ChatLayout,
  ChatRoot,
  useChatLocaleText,
} from './chat';
export {
  ConversationHeader,
  ConversationHeaderActions,
  ConversationHeaderInfo,
  ConversationRoot,
  ConversationSubtitle,
  ConversationTitle,
} from './conversation';
export {
  ComposerAttachButton,
  ComposerAttachmentList,
  ComposerHelperText,
  ComposerLabel,
  ComposerRoot,
  ComposerSendButton,
  ComposerTextArea,
  ComposerToolbar,
  useComposerContext,
} from './composer';
export {
  ConversationListItem,
  ConversationListItemActions,
  ConversationListItemAvatar,
  ConversationListItemContent,
  ConversationListPreview,
  ConversationListRoot,
  ConversationListTimestamp,
  ConversationListTitle,
  ConversationListUnreadBadge,
} from './conversation-list';
export { ScrollToBottomAffordance, TypingIndicator, UnreadMarker } from './indicators';
export {
  FilePart,
  MessageActions,
  MessageActionsMenu,
  MessageActionsMenuGroup,
  MessageActionsMenuGroupLabel,
  MessageActionsMenuItem,
  MessageActionsMenuPopup,
  MessageActionsMenuPositioner,
  MessageActionsMenuRoot,
  MessageActionsMenuTrigger,
  MessageAuthorLabel,
  MessageAvatar,
  MessageContent,
  MessageMeta,
  MessageRoot,
  ReasoningPart,
  SourceDocumentPart,
  SourceUrlPart,
  ToolPart,
  createFilePartRenderer,
  createReasoningPartRenderer,
  createSourceDocumentPartRenderer,
  createSourceUrlPartRenderer,
  createToolPartRenderer,
} from './message';
export { getDefaultMessagePartRenderer } from './message/defaultMessagePartRenderers';
export { MessageGroup, createTimeWindowGroupKey } from './message-group';
export { SuggestionItem, SuggestionsRoot } from './suggestions';
export { MessageListDateDivider, MessageListRoot, useMessageListContext } from './message-list';

export type {
  ChatLayoutProps,
  ChatLayoutSlotProps,
  ChatLayoutSlots,
  ChatRootProps,
  ChatRootSlotProps,
  ChatRootSlots,
} from './chat';
export type {
  ConversationHeaderActionsProps,
  ConversationHeaderActionsSlotProps,
  ConversationHeaderActionsSlots,
  ConversationHeaderInfoProps,
  ConversationHeaderInfoSlotProps,
  ConversationHeaderInfoSlots,
  ConversationHeaderProps,
  ConversationHeaderSlotProps,
  ConversationHeaderSlots,
  ConversationRootProps,
  ConversationRootSlotProps,
  ConversationRootSlots,
  ConversationSubtitleProps,
  ConversationSubtitleSlotProps,
  ConversationSubtitleSlots,
  ConversationTitleProps,
  ConversationTitleSlotProps,
  ConversationTitleSlots,
} from './conversation';
export type {
  ComposerAttachButtonProps,
  ComposerAttachButtonSlotProps,
  ComposerAttachButtonSlots,
  ComposerHelperTextProps,
  ComposerHelperTextSlotProps,
  ComposerHelperTextSlots,
  ComposerLabelProps,
  ComposerLabelSlotProps,
  ComposerLabelSlots,
  ComposerRootProps,
  ComposerRootSlotProps,
  ComposerRootSlots,
  ComposerSendButtonProps,
  ComposerSendButtonSlotProps,
  ComposerSendButtonSlots,
  ComposerTextAreaProps,
  ComposerTextAreaSlotProps,
  ComposerTextAreaSlots,
  ComposerToolbarProps,
  ComposerToolbarSlotProps,
  ComposerToolbarSlots,
  ComposerAttachmentListProps,
  ComposerAttachmentListSlotProps,
  ComposerAttachmentListSlots,
} from './composer';
export type {
  ConversationListItemAvatarProps,
  ConversationListItemAvatarSlotProps,
  ConversationListItemAvatarSlots,
  ConversationListItemContentProps,
  ConversationListItemContentSlotProps,
  ConversationListItemContentSlots,
  ConversationListItemProps,
  ConversationListItemSlotProps,
  ConversationListItemSlots,
  ConversationListPreviewProps,
  ConversationListPreviewSlotProps,
  ConversationListPreviewSlots,
  ConversationListRootProps,
  ConversationListRootSlotProps,
  ConversationListRootSlots,
  ConversationListTimestampProps,
  ConversationListTimestampSlotProps,
  ConversationListTimestampSlots,
  ConversationListTitleProps,
  ConversationListTitleSlotProps,
  ConversationListTitleSlots,
  ConversationListUnreadBadgeProps,
  ConversationListUnreadBadgeSlotProps,
  ConversationListUnreadBadgeSlots,
  ConversationListItemActionsProps,
  ConversationListItemActionsSlotProps,
  ConversationListItemActionsSlots,
  ConversationListVariant,
} from './conversation-list';
export type {
  ScrollToBottomAffordanceProps,
  ScrollToBottomAffordanceSlotProps,
  ScrollToBottomAffordanceSlots,
  TypingIndicatorProps,
  TypingIndicatorSlotProps,
  TypingIndicatorSlots,
  UnreadMarkerProps,
  UnreadMarkerSlotProps,
  UnreadMarkerSlots,
} from './indicators';
export type {
  FilePartExternalProps,
  FilePartOwnerState,
  FilePartProps,
  FilePartSlotProps,
  FilePartSlots,
  MessageActionsProps,
  MessageActionsSlotProps,
  MessageActionsSlots,
  MessageActionsMenuGroupLabelProps,
  MessageActionsMenuGroupProps,
  MessageActionsMenuItemProps,
  MessageActionsMenuPopupProps,
  MessageActionsMenuPositionerProps,
  MessageActionsMenuRootProps,
  MessageActionsMenuTriggerProps,
  MessageAuthorLabelProps,
  MessageAuthorLabelSlotProps,
  MessageAuthorLabelSlots,
  MessageAvatarProps,
  MessageAvatarSlotProps,
  MessageAvatarSlots,
  MessageContentPartProps,
  MessageContentProps,
  MessageContentSlotProps,
  MessageContentSlots,
  MessageMetaProps,
  MessageMetaSlotProps,
  MessageMetaSlots,
  MessageRootProps,
  MessageRootSlotProps,
  MessageRootSlots,
  ReasoningPartExternalProps,
  ReasoningPartOwnerState,
  ReasoningPartProps,
  ReasoningPartSlotProps,
  ReasoningPartSlots,
  SourceDocumentPartExternalProps,
  SourceDocumentPartOwnerState,
  SourceDocumentPartProps,
  SourceDocumentPartSlotProps,
  SourceDocumentPartSlots,
  SourceUrlPartExternalProps,
  SourceUrlPartOwnerState,
  SourceUrlPartProps,
  SourceUrlPartSlotProps,
  SourceUrlPartSlots,
  ToolPartExternalProps,
  ToolPartOwnerState,
  ToolPartProps,
  ToolPartSectionOwnerState,
  ToolPartSlotProps,
  ToolPartSlots,
} from './message';
export type {
  ChatSuggestion,
  SuggestionItemProps,
  SuggestionItemSlotProps,
  SuggestionItemSlots,
  SuggestionsRootProps,
  SuggestionsRootSlotProps,
  SuggestionsRootSlots,
} from './suggestions';
export type { GroupKeyFn, MessageGroupProps, MessageGroupSlotProps, MessageGroupSlots } from './message-group';
export type {
  MessageListDateDividerProps,
  MessageListDateDividerSlotProps,
  MessageListDateDividerSlots,
  MessageListRootAutoScrollConfig,
  MessageListRootHandle,
  MessageListRootProps,
  MessageListRootSlotProps,
  MessageListRootSlots,
} from './message-list';

// OwnerState types
export type { ChatLayoutOwnerState, ChatLayoutPaneOwnerState, ChatRootOwnerState } from './chat';
export type {
  ConversationHeaderActionsOwnerState,
  ConversationHeaderInfoOwnerState,
  ConversationHeaderOwnerState,
  ConversationOwnerState,
  ConversationRootOwnerState,
  ConversationSubtitleOwnerState,
  ConversationTitleOwnerState,
} from './conversation';
export type {
  ComposerAttachButtonOwnerState,
  ComposerAttachmentListOwnerState,
  ComposerHelperTextOwnerState,
  ComposerOwnerState,
  ComposerRootOwnerState,
  ComposerSendButtonOwnerState,
  ComposerTextAreaOwnerState,
  ComposerToolbarOwnerState,
  // ComposerLabel uses ComposerOwnerState (no separate type needed)
} from './composer';
export type {
  ConversationListItemAvatarOwnerState,
  ConversationListItemContentOwnerState,
  ConversationListItemOwnerState,
  ConversationListPreviewOwnerState,
  ConversationListRootOwnerState,
  ConversationListTimestampOwnerState,
  ConversationListTitleOwnerState,
  ConversationListUnreadBadgeOwnerState,
  ConversationListItemActionsOwnerState,
} from './conversation-list';
export type {
  ScrollToBottomAffordanceOwnerState,
  TypingIndicatorOwnerState,
  UnreadMarkerOwnerState,
} from './indicators';
export type {
  MessageActionsOwnerState,
  MessageAuthorLabelOwnerState,
  MessageAvatarOwnerState,
  MessageContentOwnerState,
  MessageMetaOwnerState,
  MessageOwnerState,
  MessageRootOwnerState,
} from './message';
// Part renderer OwnerState types are exported via the type block above (FilePartOwnerState, etc.)
export type { SuggestionItemOwnerState, SuggestionsRootOwnerState } from './suggestions';
export type { MessageGroupOwnerState } from './message-group';
export type { MessageListDateDividerOwnerState, MessageListRootOwnerState } from './message-list';
export type { MessageListContextValue } from './message-list';

// Locale types
export type { ChatLocaleText, ChatLocaleTypingUser } from './chat';

// Variant types
export type { ChatVariant } from './chat';
export { ChatVariantProvider, useChatVariant } from './chat';

// Density types
export type { ChatDensity } from './chat';
export { ChatDensityProvider, useChatDensity } from './chat';

// Namespace exports for dot-notation usage (e.g. <Chat.Root />, <Message.Avatar />)
export const Chat = {
  Root: ChatRoot,
  Layout: ChatLayout,
};

export const Conversation = {
  Root: ConversationRoot,
  Header: ConversationHeader,
  HeaderActions: ConversationHeaderActions,
  Title: ConversationTitle,
  Subtitle: ConversationSubtitle,
};

export const ConversationList = {
  Root: ConversationListRoot,
};

export const Composer = {
  Root: ComposerRoot,
  TextArea: ComposerTextArea,
  SendButton: ComposerSendButton,
  AttachButton: ComposerAttachButton,
  AttachmentList: ComposerAttachmentList,
  Toolbar: ComposerToolbar,
  HelperText: ComposerHelperText,
};

export const Message = {
  Root: MessageRoot,
  Avatar: MessageAvatar,
  Content: MessageContent,
  Meta: MessageMeta,
  Actions: MessageActions,
};

export const MessageList = {
  Root: MessageListRoot,
  DateDivider: MessageListDateDivider,
};

export const Indicators = {
  TypingIndicator,
  UnreadMarker,
  ScrollToBottomAffordance,
};
