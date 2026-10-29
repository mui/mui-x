import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatConversationPlayground from './ChatConversationPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatConversationPlayground, { ClientProvider });
