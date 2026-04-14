import { MessageContent } from '@mui/x-chat/headless';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesMessageContent = createTypes(import.meta.url, MessageContent);
