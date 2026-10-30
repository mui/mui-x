import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessageListPlayground from './ChatMessageListPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessageListPlayground, { ClientProvider });
