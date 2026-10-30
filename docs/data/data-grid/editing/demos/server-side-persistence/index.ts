import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSidePersistence from './ServerSidePersistence';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSidePersistence, { ClientProvider });
