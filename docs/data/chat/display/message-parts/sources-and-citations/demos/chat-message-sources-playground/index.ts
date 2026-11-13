import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessageSourcesPlayground from './ChatMessageSourcesPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessageSourcesPlayground, { ClientProvider });
