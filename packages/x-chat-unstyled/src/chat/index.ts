import { ChatLayout } from './ChatLayout';
import { ChatRoot } from './ChatRoot';

export { ChatRoot } from './ChatRoot';
export { ChatLayout } from './ChatLayout';

export type {
  ChatLayoutOwnerState,
  ChatLayoutPaneOwnerState,
  ChatLayoutProps,
  ChatLayoutSlotProps,
  ChatLayoutSlots,
} from './ChatLayout';
export type {
  ChatRootOwnerState,
  ChatRootProps,
  ChatRootSlotProps,
  ChatRootSlots,
} from './ChatRoot';

export const Chat = {
  Root: ChatRoot,
  Layout: ChatLayout,
} as const;
