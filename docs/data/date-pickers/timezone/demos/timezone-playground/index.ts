import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TimezonePlayground from './TimezonePlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, TimezonePlayground, { ClientProvider });
