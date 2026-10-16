import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSortingGrid from './ServerSortingGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSortingGrid, { ClientProvider });
