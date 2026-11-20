import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ConversationSidebar from './ConversationSidebar';
import ClientProvider from './client';

export default createDemo(import.meta.url, ConversationSidebar, { ClientProvider });
