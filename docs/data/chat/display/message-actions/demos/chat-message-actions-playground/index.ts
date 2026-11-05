import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessageActionsPlayground from './ChatMessageActionsPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessageActionsPlayground, { ClientProvider });
