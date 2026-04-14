import { ChatProvider } from '/packages/x-chat-headless/src/ChatProvider.tsx';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesChatProvider = createTypes(import.meta.url, ChatProvider);
