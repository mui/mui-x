import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideCursorNonBlocking from './ServerSideCursorNonBlocking';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideCursorNonBlocking, { ClientProvider });
