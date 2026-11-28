import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MessageFeed from './MessageFeed';
import ClientProvider from './client';

export default createDemo(import.meta.url, MessageFeed, { ClientProvider });
