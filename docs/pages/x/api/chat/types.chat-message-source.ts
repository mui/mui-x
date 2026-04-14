import { ChatMessageSource } from '@mui/x-chat/ChatMessageSources';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesChatMessageSource = createTypes(import.meta.url, ChatMessageSource);
