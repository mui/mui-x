// Generic, host-agnostic Copilot panel UI composed from @mui/x-chat primitives.
// More components are added in later steps; this barrel currently exports the
// shared classes + types and the generic leaf presenters.

export { CopilotMessageMetadata } from './CopilotMessageMetadata';
export type { CopilotMessageMetadataProps } from './CopilotMessageMetadata';
export { CopilotMessageFooter } from './CopilotMessageFooter';
export type { CopilotMessageFooterProps } from './CopilotMessageFooter';
export { CopilotFeedbackProvider, useCopilotFeedback } from './CopilotFeedbackProvider';
export type { CopilotFeedbackProviderProps } from './CopilotFeedbackProvider';
export { CopilotStreamingIndicator } from './CopilotStreamingIndicator';
export type { CopilotStreamingIndicatorProps } from './CopilotStreamingIndicator';
export { CopilotToolBlock } from './CopilotToolBlock';
export type {
  CopilotToolBlockProps,
  CopilotToolBlockOwnerState,
  CopilotToolBlockAppliedChanges,
} from './CopilotToolBlock';
export { CopilotTurnSpacer } from './CopilotTurnSpacer';
export { CopilotEmptyState } from './CopilotEmptyState';
export type { CopilotEmptyStateProps } from './CopilotEmptyState';
export { CopilotVoiceButton } from './CopilotVoiceButton';
export type { CopilotVoiceButtonProps } from './CopilotVoiceButton';
export { CopilotHistoryView } from './CopilotHistoryView';
export type { CopilotHistoryViewProps } from './CopilotHistoryView';
export { CopilotMenuView } from './CopilotMenuView';
export type { CopilotMenuViewProps } from './CopilotMenuView';
export {
  CopilotSuggestions,
  getLastMessageSuggestions,
  getSuggestionValue,
  getSuggestionLabel,
} from './CopilotSuggestions';
export type { CopilotSuggestionsProps } from './CopilotSuggestions';
export { CopilotMessageItem } from './CopilotMessageItem';
export type { CopilotMessageItemProps } from './CopilotMessageItem';
export { CopilotThreadView } from './CopilotThreadView';
export type { CopilotThreadViewProps } from './CopilotThreadView';
export { CopilotChatPanel, CopilotChatPanelContent } from './CopilotChatPanel';

export {
  copilotPanelClasses,
  getCopilotPanelUtilityClass,
  useCopilotPanelUtilityClasses,
} from './copilotPanelClasses';
export type { CopilotPanelClasses, CopilotPanelClassKey } from './copilotPanelClasses';

export type {
  CopilotChatPanelProps,
  CopilotChatPanelContentProps,
  CopilotChatPanelSlots,
  CopilotChatPanelAppliedChangesProps,
  CopilotChatPanelDataQueryApprovalProps,
  CopilotChatPanelAbVariantTabsProps,
  CopilotChatPanelMetadataCardProps,
  CopilotAuthorName,
  CopilotMessageVariant,
  CopilotPanelLocaleText,
  CopilotPanelIcons,
  CopilotFeedbackPayload,
  CopilotFeedbackSubmit,
  HistoryCapableChatAdapter,
} from './CopilotChatPanel.types';
