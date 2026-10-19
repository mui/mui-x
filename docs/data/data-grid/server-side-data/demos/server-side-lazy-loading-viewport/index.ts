import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingViewport from './ServerSideLazyLoadingViewport';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingViewport, { ClientProvider });
