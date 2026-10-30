import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ErrorHandling from './ErrorHandling';
import ClientProvider from './client';

export default createDemo(import.meta.url, ErrorHandling, { ClientProvider });
