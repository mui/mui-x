import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingRequestThrottle from './ServerSideLazyLoadingRequestThrottle';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingRequestThrottle, {
  ClientProvider,
});
