import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SyncHighlight from './SyncHighlight';
import ClientProvider from './client';

export default createDemo(import.meta.url, SyncHighlight, { ClientProvider });
