import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatBoxPlayground from './ChatBoxPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatBoxPlayground, { ClientProvider });
