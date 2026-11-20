import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatConversationListPlayground from './ChatConversationListPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatConversationListPlayground, { ClientProvider });
