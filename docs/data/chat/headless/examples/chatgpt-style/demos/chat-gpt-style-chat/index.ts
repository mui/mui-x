import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatGptStyleChat from './ChatGptStyleChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatGptStyleChat, { ClientProvider });
