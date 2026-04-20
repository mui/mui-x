import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type {
  ChatLayoutSlotProps,
  ChatRootSlotProps,
  ComposerAttachButtonSlotProps,
  ComposerAttachmentListSlotProps,
  ComposerHelperTextSlotProps,
  ComposerLabelSlotProps,
  ComposerRootSlotProps,
  ComposerSendButtonSlotProps,
  ComposerTextAreaSlotProps,
  ComposerToolbarSlotProps,
  ConversationHeaderActionsSlotProps,
  ConversationHeaderInfoSlotProps,
  ConversationHeaderSlotProps,
  ConversationListItemActionsSlotProps,
  ConversationListItemAvatarSlotProps,
  ConversationListItemContentSlotProps,
  ConversationListItemSlotProps,
  ConversationListPreviewSlotProps,
  ConversationListRootSlotProps,
  ConversationListTimestampSlotProps,
  ConversationListTitleSlotProps,
  ConversationListUnreadBadgeSlotProps,
  ConversationRootSlotProps,
  ConversationSubtitleSlotProps,
  ConversationTitleSlotProps,
  FilePartSlotProps,
  MessageActionsSlotProps,
  MessageAuthorLabelSlotProps,
  MessageAvatarSlotProps,
  MessageContentSlotProps,
  MessageGroupSlotProps,
  MessageListDateDividerSlotProps,
  MessageListRootSlotProps,
  MessageMetaSlotProps,
  MessageRootSlotProps,
  ReasoningPartSlotProps,
  ScrollToBottomAffordanceSlotProps,
  SourceDocumentPartSlotProps,
  SourceUrlPartSlotProps,
  SuggestionItemSlotProps,
  SuggestionsRootSlotProps,
  ToolPartSlotProps,
  TypingIndicatorSlotProps,
  UnreadMarkerSlotProps,
} from '@mui/x-chat-headless';

// Compile-time assertion: every slot in every exported SlotProps type of `x-chat-headless`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.

type AssertChatLayout = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatLayoutSlotProps, 'ChatLayout'>>
>;
type AssertChatRoot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatRootSlotProps, 'ChatRoot'>>
>;
type AssertComposerAttachButton = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ComposerAttachButtonSlotProps, 'ComposerAttachButton'>>
>;
type AssertComposerAttachmentList = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ComposerAttachmentListSlotProps, 'ComposerAttachmentList'>
  >
>;
type AssertComposerHelperText = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ComposerHelperTextSlotProps, 'ComposerHelperText'>>
>;
type AssertComposerLabel = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ComposerLabelSlotProps, 'ComposerLabel'>>
>;
type AssertComposerRoot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ComposerRootSlotProps, 'ComposerRoot'>>
>;
type AssertComposerSendButton = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ComposerSendButtonSlotProps, 'ComposerSendButton'>>
>;
type AssertComposerTextArea = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ComposerTextAreaSlotProps, 'ComposerTextArea'>>
>;
type AssertComposerToolbar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ComposerToolbarSlotProps, 'ComposerToolbar'>>
>;
type AssertConversationHeaderActions = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ConversationHeaderActionsSlotProps,
      'ConversationHeaderActions'
    >
  >
>;
type AssertConversationHeaderInfo = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ConversationHeaderInfoSlotProps, 'ConversationHeaderInfo'>
  >
>;
type AssertConversationHeader = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ConversationHeaderSlotProps, 'ConversationHeader'>>
>;
type AssertConversationListItemActions = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ConversationListItemActionsSlotProps,
      'ConversationListItemActions'
    >
  >
>;
type AssertConversationListItemAvatar = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ConversationListItemAvatarSlotProps,
      'ConversationListItemAvatar'
    >
  >
>;
type AssertConversationListItemContent = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ConversationListItemContentSlotProps,
      'ConversationListItemContent'
    >
  >
>;
type AssertConversationListItem = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ConversationListItemSlotProps, 'ConversationListItem'>>
>;
type AssertConversationListPreview = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ConversationListPreviewSlotProps, 'ConversationListPreview'>
  >
>;
type AssertConversationListRoot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ConversationListRootSlotProps, 'ConversationListRoot'>>
>;
type AssertConversationListTimestamp = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ConversationListTimestampSlotProps,
      'ConversationListTimestamp'
    >
  >
>;
type AssertConversationListTitle = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<ConversationListTitleSlotProps, 'ConversationListTitle'>
  >
>;
type AssertConversationListUnreadBadge = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ConversationListUnreadBadgeSlotProps,
      'ConversationListUnreadBadge'
    >
  >
>;
type AssertConversationRoot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ConversationRootSlotProps, 'ConversationRoot'>>
>;
type AssertConversationSubtitle = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ConversationSubtitleSlotProps, 'ConversationSubtitle'>>
>;
type AssertConversationTitle = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ConversationTitleSlotProps, 'ConversationTitle'>>
>;
type AssertFilePart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<FilePartSlotProps, 'FilePart'>>
>;
type AssertMessageActions = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageActionsSlotProps, 'MessageActions'>>
>;
type AssertMessageAuthorLabel = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageAuthorLabelSlotProps, 'MessageAuthorLabel'>>
>;
type AssertMessageAvatar = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageAvatarSlotProps, 'MessageAvatar'>>
>;
type AssertMessageContent = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageContentSlotProps, 'MessageContent'>>
>;
type AssertMessageGroup = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageGroupSlotProps, 'MessageGroup'>>
>;
type AssertMessageListDateDivider = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<MessageListDateDividerSlotProps, 'MessageListDateDivider'>
  >
>;
type AssertMessageListRoot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageListRootSlotProps, 'MessageListRoot'>>
>;
type AssertMessageMeta = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageMetaSlotProps, 'MessageMeta'>>
>;
type AssertMessageRoot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<MessageRootSlotProps, 'MessageRoot'>>
>;
type AssertReasoningPart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ReasoningPartSlotProps, 'ReasoningPart'>>
>;
type AssertScrollToBottomAffordance = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      ScrollToBottomAffordanceSlotProps,
      'ScrollToBottomAffordance'
    >
  >
>;
type AssertSourceDocumentPart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SourceDocumentPartSlotProps, 'SourceDocumentPart'>>
>;
type AssertSourceUrlPart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SourceUrlPartSlotProps, 'SourceUrlPart'>>
>;
type AssertSuggestionItem = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SuggestionItemSlotProps, 'SuggestionItem'>>
>;
type AssertSuggestionsRoot = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<SuggestionsRootSlotProps, 'SuggestionsRoot'>>
>;
type AssertToolPart = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ToolPartSlotProps, 'ToolPart'>>
>;
type AssertTypingIndicator = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<TypingIndicatorSlotProps, 'TypingIndicator'>>
>;
type AssertUnreadMarker = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<UnreadMarkerSlotProps, 'UnreadMarker'>>
>;
