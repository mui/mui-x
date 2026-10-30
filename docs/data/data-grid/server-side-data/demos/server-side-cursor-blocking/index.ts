import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideCursorBlocking from './ServerSideCursorBlocking';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideCursorBlocking, { ClientProvider });
