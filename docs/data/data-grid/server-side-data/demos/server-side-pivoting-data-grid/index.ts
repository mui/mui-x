import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSidePivotingDataGrid from './ServerSidePivotingDataGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSidePivotingDataGrid, { ClientProvider });
