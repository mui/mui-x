import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideDataGridAggregation from './ServerSideDataGridAggregation';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideDataGridAggregation, { ClientProvider });
