import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideDataGridAggregationPivoting from './ServerSideDataGridAggregationPivoting';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideDataGridAggregationPivoting, {
  ClientProvider,
});
