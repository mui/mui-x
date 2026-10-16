import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideRowGroupingNestedLazyLoading from './ServerSideRowGroupingNestedLazyLoading';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideRowGroupingNestedLazyLoading, {
  ClientProvider,
});
