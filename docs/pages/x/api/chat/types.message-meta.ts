import { MessageMeta } from '@mui/x-chat/headless';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesMessageMeta = createTypes(import.meta.url, MessageMeta);
