import { ConversationHeaderActions } from './ConversationHeaderActions';
import { ConversationHeader } from './ConversationHeader';
import { ConversationHeaderInfo } from './ConversationHeaderInfo';
import { ConversationRoot } from './ConversationRoot';
import { ConversationSubtitle } from './ConversationSubtitle';
import { ConversationTitle } from './ConversationTitle';

export { ConversationRoot } from './ConversationRoot';
export { ConversationHeader } from './ConversationHeader';
export { ConversationHeaderInfo } from './ConversationHeaderInfo';
export { ConversationTitle } from './ConversationTitle';
export { ConversationSubtitle } from './ConversationSubtitle';
export { ConversationHeaderActions } from './ConversationHeaderActions';

export type {
  ConversationRootProps,
  ConversationRootSlotProps,
  ConversationRootSlots,
} from './ConversationRoot';
export type {
  ConversationHeaderProps,
  ConversationHeaderSlotProps,
  ConversationHeaderSlots,
} from './ConversationHeader';
export type {
  ConversationHeaderInfoProps,
  ConversationHeaderInfoSlotProps,
  ConversationHeaderInfoSlots,
} from './ConversationHeaderInfo';
export type {
  ConversationTitleProps,
  ConversationTitleSlotProps,
  ConversationTitleSlots,
} from './ConversationTitle';
export type {
  ConversationSubtitleProps,
  ConversationSubtitleSlotProps,
  ConversationSubtitleSlots,
} from './ConversationSubtitle';
export type {
  ConversationHeaderActionsProps,
  ConversationHeaderActionsSlotProps,
  ConversationHeaderActionsSlots,
} from './ConversationHeaderActions';
export type {
  ConversationHeaderActionsOwnerState,
  ConversationHeaderInfoOwnerState,
  ConversationHeaderOwnerState,
  ConversationOwnerState,
  ConversationRootOwnerState,
  ConversationSubtitleOwnerState,
  ConversationTitleOwnerState,
} from './conversation.types';

export const Conversation = {
  Root: ConversationRoot,
  Header: ConversationHeader,
  HeaderInfo: ConversationHeaderInfo,
  Title: ConversationTitle,
  Subtitle: ConversationSubtitle,
  HeaderActions: ConversationHeaderActions,
} as const;
