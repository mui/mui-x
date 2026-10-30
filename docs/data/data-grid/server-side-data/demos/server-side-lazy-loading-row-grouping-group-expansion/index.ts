import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingRowGroupingGroupExpansion from './ServerSideLazyLoadingRowGroupingGroupExpansion';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingRowGroupingGroupExpansion, {
  ClientProvider,
});
