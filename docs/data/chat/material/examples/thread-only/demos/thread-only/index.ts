import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ThreadOnly from './ThreadOnly';
import ClientProvider from './client';

export default createDemo(import.meta.url, ThreadOnly, { ClientProvider });
