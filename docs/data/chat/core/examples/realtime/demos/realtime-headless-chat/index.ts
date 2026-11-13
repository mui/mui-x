import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import RealtimeHeadlessChat from './RealtimeHeadlessChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, RealtimeHeadlessChat, { ClientProvider });
