import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingModeUpdate from './ServerSideLazyLoadingModeUpdate';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingModeUpdate, { ClientProvider });
