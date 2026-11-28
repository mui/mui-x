import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingTreeDataGroupExpansion from './ServerSideLazyLoadingTreeDataGroupExpansion';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingTreeDataGroupExpansion, {
  ClientProvider,
});
