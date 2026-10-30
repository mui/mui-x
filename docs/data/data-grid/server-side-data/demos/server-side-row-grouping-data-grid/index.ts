import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideRowGroupingDataGrid from './ServerSideRowGroupingDataGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideRowGroupingDataGrid, { ClientProvider });
