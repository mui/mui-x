import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatMessageErrorPlayground from './ChatMessageErrorPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatMessageErrorPlayground, { ClientProvider });
