import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatStreamingPlayground from './ChatStreamingPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatStreamingPlayground, { ClientProvider });
