import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessagePlayground from './ChatMessagePlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessagePlayground, { ClientProvider });
