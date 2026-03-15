import { MessageActions } from './MessageActions';
import { MessageAvatar } from './MessageAvatar';
import { MessageContent } from './MessageContent';
import { MessageMeta } from './MessageMeta';
import { MessageRoot } from './MessageRoot';

export { MessageRoot } from './MessageRoot';
export { MessageAvatar } from './MessageAvatar';
export { MessageContent } from './MessageContent';
export { MessageMeta } from './MessageMeta';
export { MessageActions } from './MessageActions';

export type {
  MessageRootProps,
  MessageRootSlotProps,
  MessageRootSlots,
} from './MessageRoot';
export type {
  MessageAvatarProps,
  MessageAvatarSlotProps,
  MessageAvatarSlots,
} from './MessageAvatar';
export type {
  MessageContentProps,
  MessageContentSlotProps,
  MessageContentSlots,
} from './MessageContent';
export type {
  MessageMetaProps,
  MessageMetaSlotProps,
  MessageMetaSlots,
} from './MessageMeta';
export type {
  MessageActionsProps,
  MessageActionsSlotProps,
  MessageActionsSlots,
} from './MessageActions';
export type {
  MessageActionsOwnerState,
  MessageAvatarOwnerState,
  MessageContentOwnerState,
  MessageOwnerState,
  MessageMetaOwnerState,
  MessageRootOwnerState,
} from './message.types';

export const Message = {
  Root: MessageRoot,
  Avatar: MessageAvatar,
  Content: MessageContent,
  Meta: MessageMeta,
  Actions: MessageActions,
} as const;
