import { ChatRoot } from '@mui/x-chat/headless';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesChatRoot = createTypes(import.meta.url, ChatRoot);
