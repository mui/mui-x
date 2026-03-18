import { ConversationListItem } from './ConversationListItem';
import { ConversationListItemAvatar } from './ConversationListItemAvatar';
import { ConversationListPreview } from './ConversationListPreview';
import { ConversationListRoot } from './ConversationListRoot';
import { ConversationListTimestamp } from './ConversationListTimestamp';
import { ConversationListTitle } from './ConversationListTitle';
import { ConversationListUnreadBadge } from './ConversationListUnreadBadge';

export { ConversationListRoot } from './ConversationListRoot';
export { ConversationListItem } from './ConversationListItem';
export { ConversationListItemAvatar } from './ConversationListItemAvatar';
export { ConversationListTitle } from './ConversationListTitle';
export { ConversationListPreview } from './ConversationListPreview';
export { ConversationListTimestamp } from './ConversationListTimestamp';
export { ConversationListUnreadBadge } from './ConversationListUnreadBadge';

export type {
  ConversationListRootProps,
  ConversationListRootSlotProps,
  ConversationListRootSlots,
} from './ConversationListRoot';
export type {
  ConversationListItemProps,
  ConversationListItemSlotProps,
  ConversationListItemSlots,
} from './ConversationListItem';
export type {
  ConversationListItemAvatarProps,
  ConversationListItemAvatarSlotProps,
  ConversationListItemAvatarSlots,
} from './ConversationListItemAvatar';
export type {
  ConversationListTitleProps,
  ConversationListTitleSlotProps,
  ConversationListTitleSlots,
} from './ConversationListTitle';
export type {
  ConversationListPreviewProps,
  ConversationListPreviewSlotProps,
  ConversationListPreviewSlots,
} from './ConversationListPreview';
export type {
  ConversationListTimestampProps,
  ConversationListTimestampSlotProps,
  ConversationListTimestampSlots,
} from './ConversationListTimestamp';
export type {
  ConversationListUnreadBadgeProps,
  ConversationListUnreadBadgeSlotProps,
  ConversationListUnreadBadgeSlots,
} from './ConversationListUnreadBadge';
export type {
  ConversationListItemAvatarOwnerState,
  ConversationListItemOwnerState,
  ConversationListPreviewOwnerState,
  ConversationListRootOwnerState,
  ConversationListTimestampOwnerState,
  ConversationListTitleOwnerState,
  ConversationListUnreadBadgeOwnerState,
} from './conversationList.types';

export const ConversationList = {
  Root: ConversationListRoot,
  Item: ConversationListItem,
  ItemAvatar: ConversationListItemAvatar,
  Title: ConversationListTitle,
  Preview: ConversationListPreview,
  Timestamp: ConversationListTimestamp,
  UnreadBadge: ConversationListUnreadBadge,
} as const;
