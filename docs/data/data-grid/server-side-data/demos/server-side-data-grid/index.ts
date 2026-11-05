import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideDataGrid from './ServerSideDataGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideDataGrid, { ClientProvider });
