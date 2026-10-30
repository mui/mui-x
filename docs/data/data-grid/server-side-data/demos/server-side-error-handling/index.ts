import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideErrorHandling from './ServerSideErrorHandling';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideErrorHandling, { ClientProvider });
