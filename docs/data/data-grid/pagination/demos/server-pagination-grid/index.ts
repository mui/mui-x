import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerPaginationGrid from './ServerPaginationGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerPaginationGrid, { ClientProvider });
