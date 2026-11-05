import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import StreamingLifecycleHeadlessChat from './StreamingLifecycleHeadlessChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, StreamingLifecycleHeadlessChat, { ClientProvider });
