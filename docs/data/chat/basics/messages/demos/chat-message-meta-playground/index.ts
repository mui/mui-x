import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessageMetaPlayground from './ChatMessageMetaPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessageMetaPlayground, { ClientProvider });
