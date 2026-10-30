import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatSuggestionsPlayground from './ChatSuggestionsPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatSuggestionsPlayground, { ClientProvider });
