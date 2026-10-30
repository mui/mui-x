import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerFilterGrid from './ServerFilterGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerFilterGrid, { ClientProvider });
