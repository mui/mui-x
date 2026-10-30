import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MinimalUnstyledShell from './MinimalUnstyledShell';
import ClientProvider from './client';

export default createDemo(import.meta.url, MinimalUnstyledShell, { ClientProvider });
