import { MessageListDateDivider } from './MessageListDateDivider';
import { MessageListRoot } from './MessageListRoot';

export { MessageListRoot } from './MessageListRoot';
export { MessageListDateDivider } from './MessageListDateDivider';

export type {
  MessageListDateDividerProps,
  MessageListDateDividerSlotProps,
  MessageListDateDividerSlots,
} from './MessageListDateDivider';
export type {
  MessageListRootAutoScrollConfig,
  MessageListRootHandle,
  MessageListRootProps,
  MessageListRootSlotProps,
  MessageListRootSlots,
} from './MessageListRoot';
export type {
  MessageListDateDividerOwnerState,
  MessageListRootOwnerState,
} from './messageList.types';

export const MessageList = {
  DateDivider: MessageListDateDivider,
  Root: MessageListRoot,
} as const;
