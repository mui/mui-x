import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ManyMessages from './ManyMessages';
import ClientProvider from './client';

export default createDemo(import.meta.url, ManyMessages, { ClientProvider });
