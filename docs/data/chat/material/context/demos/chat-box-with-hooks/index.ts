import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatBoxWithHooks from './ChatBoxWithHooks';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatBoxWithHooks, { ClientProvider });
