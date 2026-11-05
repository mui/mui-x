import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingErrorHandling from './ServerSideLazyLoadingErrorHandling';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingErrorHandling, { ClientProvider });
