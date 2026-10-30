import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessageGroupPlayground from './ChatMessageGroupPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessageGroupPlayground, { ClientProvider });
