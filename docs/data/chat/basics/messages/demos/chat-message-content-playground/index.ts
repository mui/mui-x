import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessageContentPlayground from './ChatMessageContentPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessageContentPlayground, { ClientProvider });
