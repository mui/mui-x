import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingRevalidationTabs from './ServerSideLazyLoadingRevalidationTabs';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingRevalidationTabs, {
  ClientProvider,
});
