import { ChatLayout } from './ChatLayout';
import { ChatRoot } from './ChatRoot';

export { ChatRoot } from './ChatRoot';
export { ChatLayout } from './ChatLayout';
export { CHAT_DEFAULT_LOCALE_TEXT } from './internals/chatLocaleText';
export type { ChatLocaleText, ChatLocaleTypingUser } from './internals/chatLocaleText';
export { useChatLocaleText } from './internals/ChatLocaleContext';
export { ChatVariantProvider, useChatVariant } from './internals/ChatVariantContext';
export type { ChatVariant } from './internals/ChatVariantContext';

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
