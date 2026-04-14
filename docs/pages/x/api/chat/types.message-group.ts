import { MessageGroup } from '@mui/x-chat/headless';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesMessageGroup = createTypes(import.meta.url, MessageGroup);
