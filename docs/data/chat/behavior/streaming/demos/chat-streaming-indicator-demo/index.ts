import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatStreamingIndicatorDemo from './ChatStreamingIndicatorDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatStreamingIndicatorDemo, { ClientProvider });
