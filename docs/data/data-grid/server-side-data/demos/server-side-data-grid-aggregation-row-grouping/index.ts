import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideDataGridAggregationRowGrouping from './ServerSideDataGridAggregationRowGrouping';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideDataGridAggregationRowGrouping, {
  ClientProvider,
});
