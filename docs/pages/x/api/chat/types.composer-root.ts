import { ComposerRoot } from '@mui/x-chat/headless';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesComposerRoot = createTypes(import.meta.url, ComposerRoot);
