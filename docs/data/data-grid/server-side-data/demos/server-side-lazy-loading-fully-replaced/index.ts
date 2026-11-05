import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideLazyLoadingFullyReplaced from './ServerSideLazyLoadingFullyReplaced';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideLazyLoadingFullyReplaced, { ClientProvider });
