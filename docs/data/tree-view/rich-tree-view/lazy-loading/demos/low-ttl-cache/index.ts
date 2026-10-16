import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LowTTLCache from './LowTTLCache';
import ClientProvider from './client';

export default createDemo(import.meta.url, LowTTLCache, { ClientProvider });
