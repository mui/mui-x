export { MessageRoot } from './MessageRoot';
export { MessageAvatar } from './MessageAvatar';
export { MessageAuthorLabel } from './MessageAuthorLabel';
export { MessageContent } from './MessageContent';
export { MessageMeta } from './MessageMeta';
export { MessageActions } from './MessageActions';
export {
  MessageActionsMenu,
  MessageActionsMenuGroup,
  MessageActionsMenuGroupLabel,
  MessageActionsMenuItem,
  MessageActionsMenuPopup,
  MessageActionsMenuPositioner,
  MessageActionsMenuRoot,
  MessageActionsMenuTrigger,
} from './MessageActionsMenu';

export type { MessageRootProps, MessageRootSlotProps, MessageRootSlots } from './MessageRoot';
export type {
  MessageAvatarProps,
  MessageAvatarSlotProps,
  MessageAvatarSlots,
} from './MessageAvatar';
export type {
  MessageAuthorLabelProps,
  MessageAuthorLabelSlotProps,
  MessageAuthorLabelSlots,
} from './MessageAuthorLabel';
export type {
  MessageContentPartProps,
  MessageContentProps,
  MessageContentSlotProps,
  MessageContentSlots,
  TextPartExternalProps,
} from './MessageContent';
export type { MessageMetaProps, MessageMetaSlotProps, MessageMetaSlots } from './MessageMeta';
export type {
  MessageActionsProps,
  MessageActionsSlotProps,
  MessageActionsSlots,
} from './MessageActions';
export type {
  MessageActionsMenuGroupLabelProps,
  MessageActionsMenuGroupProps,
  MessageActionsMenuItemProps,
  MessageActionsMenuPopupProps,
  MessageActionsMenuPositionerProps,
  MessageActionsMenuRootProps,
  MessageActionsMenuTriggerProps,
} from './MessageActionsMenu';
export type {
  MessageActionsOwnerState,
  MessageAuthorLabelOwnerState,
  MessageAvatarOwnerState,
  MessageContentOwnerState,
  MessageOwnerState,
  MessageMetaOwnerState,
  MessageRootOwnerState,
} from './message.types';

// Part renderer components
export {
  FilePart,
  ReasoningPart,
  SourceDocumentPart,
  SourceUrlPart,
  ToolPart,
  createFilePartRenderer,
  createReasoningPartRenderer,
  createSourceDocumentPartRenderer,
  createSourceUrlPartRenderer,
  createToolPartRenderer,
} from './parts';

export type {
  FilePartExternalProps,
  FilePartOwnerState,
  FilePartProps,
  FilePartSlotProps,
  FilePartSlots,
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
} from './parts';

// Part utilities
export {
  extractLanguage,
  formatStructuredValue,
  normalizeCodeContent,
  normalizeMarkdownForRender,
  safeUri,
  shouldCollapsePayload,
} from './parts';
