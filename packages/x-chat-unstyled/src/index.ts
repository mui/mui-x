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
import {
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
  ComposerAttachButton,
  ComposerAttachmentList,
  ComposerHelperText,
  ComposerLabel,
  ComposerRoot,
  ComposerSendButton,
  ComposerTextArea,
  ComposerToolbar,
  useComposerContext,
  ConversationListItem,
  ConversationListItemActions,
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
