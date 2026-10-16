import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LongMessages from './LongMessages';
import ClientProvider from './client';

export default createDemo(import.meta.url, LongMessages, { ClientProvider });
