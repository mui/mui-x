import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideDataGridTTL from './ServerSideDataGridTTL';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideDataGridTTL, { ClientProvider });
