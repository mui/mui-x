import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideRowGroupingExpansionPersistence from './ServerSideRowGroupingExpansionPersistence';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideRowGroupingExpansionPersistence, {
  ClientProvider,
});
