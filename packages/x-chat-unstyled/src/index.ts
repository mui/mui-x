import { ChatLayout, ChatRoot, useChatLocaleText } from './chat';
import {
  ConversationHeader,
  ConversationHeaderActions,
  ConversationHeaderInfo,
  ConversationRoot,
  ConversationSubtitle,
  ConversationTitle,
} from './conversation';
import {
  ConversationInputAttachButton,
  ConversationInputHelperText,
  ConversationInputLabel,
  ConversationInputRoot,
  ConversationInputSendButton,
  ConversationInputTextArea,
  ConversationInputToolbar,
} from './conversation-input';
import {
  ConversationListItem,
  ConversationListItemAvatar,
  ConversationListItemContent,
  ConversationListPreview,
  ConversationListRoot,
  ConversationListTimestamp,
  ConversationListTitle,
  ConversationListUnreadBadge,
} from './conversation-list';
import { ScrollToBottomAffordance, TypingIndicator, UnreadMarker } from './indicators';
import {
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
import { getDefaultMessagePartRenderer } from './message/defaultMessagePartRenderers';
import { SuggestionItem, SuggestionsRoot } from './suggestions';
import { MessageGroup } from './message-group';
import { MessageListDateDivider, MessageListRoot } from './message-list';

export {
  ChatLayout,
  ChatRoot,
  useChatLocaleText,
  ConversationHeader,
  ConversationHeaderActions,
  ConversationHeaderInfo,
  ConversationRoot,
  ConversationSubtitle,
  ConversationTitle,
  ConversationInputAttachButton,
  ConversationInputHelperText,
  ConversationInputLabel,
  ConversationInputRoot,
  ConversationInputSendButton,
  ConversationInputTextArea,
  ConversationInputToolbar,
  ConversationListItem,
  ConversationListItemAvatar,
  ConversationListItemContent,
  ConversationListPreview,
  ConversationListRoot,
  ConversationListTimestamp,
  ConversationListTitle,
  ConversationListUnreadBadge,
  ScrollToBottomAffordance,
  TypingIndicator,
  UnreadMarker,
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
  getDefaultMessagePartRenderer,
  SuggestionItem,
  SuggestionsRoot,
  MessageGroup,
  MessageListDateDivider,
  MessageListRoot,
};

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
  ConversationInputAttachButtonProps,
  ConversationInputAttachButtonSlotProps,
  ConversationInputAttachButtonSlots,
  ConversationInputHelperTextProps,
  ConversationInputHelperTextSlotProps,
  ConversationInputHelperTextSlots,
  ConversationInputLabelProps,
  ConversationInputLabelSlotProps,
  ConversationInputLabelSlots,
  ConversationInputRootProps,
  ConversationInputRootSlotProps,
  ConversationInputRootSlots,
  ConversationInputSendButtonProps,
  ConversationInputSendButtonSlotProps,
  ConversationInputSendButtonSlots,
  ConversationInputTextAreaProps,
  ConversationInputTextAreaSlotProps,
  ConversationInputTextAreaSlots,
  ConversationInputToolbarProps,
  ConversationInputToolbarSlotProps,
  ConversationInputToolbarSlots,
} from './conversation-input';
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
export type { MessageGroupProps, MessageGroupSlotProps, MessageGroupSlots } from './message-group';
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
  ConversationInputAttachButtonOwnerState,
  ConversationInputHelperTextOwnerState,
  ConversationInputOwnerState,
  ConversationInputRootOwnerState,
  ConversationInputSendButtonOwnerState,
  ConversationInputTextAreaOwnerState,
  ConversationInputToolbarOwnerState,
  // ConversationInputLabel uses ConversationInputOwnerState (no separate type needed)
} from './conversation-input';
export type {
  ConversationListItemAvatarOwnerState,
  ConversationListItemContentOwnerState,
  ConversationListItemOwnerState,
  ConversationListPreviewOwnerState,
  ConversationListRootOwnerState,
  ConversationListTimestampOwnerState,
  ConversationListTitleOwnerState,
  ConversationListUnreadBadgeOwnerState,
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

// Locale types
export type { ChatLocaleText, ChatLocaleTypingUser } from './chat';

// Variant types
export type { ChatVariant } from './chat';
export { ChatVariantProvider, useChatVariant } from './chat';

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

export const ConversationInput = {
  Root: ConversationInputRoot,
  TextArea: ConversationInputTextArea,
  SendButton: ConversationInputSendButton,
  AttachButton: ConversationInputAttachButton,
  Toolbar: ConversationInputToolbar,
  HelperText: ConversationInputHelperText,
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
