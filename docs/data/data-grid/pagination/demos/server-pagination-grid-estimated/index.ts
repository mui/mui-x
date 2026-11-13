import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerPaginationGridEstimated from './ServerPaginationGridEstimated';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerPaginationGridEstimated, { ClientProvider });
