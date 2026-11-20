import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import EchoAdapterCannedReplies from './EchoAdapterCannedReplies';
import ClientProvider from './client';

export default createDemo(import.meta.url, EchoAdapterCannedReplies, { ClientProvider });
