import { ConversationListItem } from './ConversationListItem';
import { ConversationListItemAvatar } from './ConversationListItemAvatar';
import { ConversationListItemMeta } from './ConversationListItemMeta';
import { ConversationListItemText } from './ConversationListItemText';
import { ConversationListRoot } from './ConversationListRoot';

export { ConversationListRoot } from './ConversationListRoot';
export { ConversationListItem } from './ConversationListItem';
export { ConversationListItemText } from './ConversationListItemText';
export { ConversationListItemMeta } from './ConversationListItemMeta';
export { ConversationListItemAvatar } from './ConversationListItemAvatar';

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
  ConversationListItemTextProps,
  ConversationListItemTextSlotProps,
  ConversationListItemTextSlots,
} from './ConversationListItemText';
export type {
  ConversationListItemMetaProps,
  ConversationListItemMetaSlotProps,
  ConversationListItemMetaSlots,
} from './ConversationListItemMeta';
export type {
  ConversationListItemAvatarProps,
  ConversationListItemAvatarSlotProps,
  ConversationListItemAvatarSlots,
} from './ConversationListItemAvatar';
export type {
  ConversationListItemAvatarOwnerState,
  ConversationListItemMetaOwnerState,
  ConversationListItemOwnerState,
  ConversationListItemTextOwnerState,
  ConversationListRootOwnerState,
} from './conversationList.types';

export const ConversationList = {
  Root: ConversationListRoot,
  Item: ConversationListItem,
  ItemText: ConversationListItemText,
  ItemMeta: ConversationListItemMeta,
  ItemAvatar: ConversationListItemAvatar,
} as const;
