import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TinyAreaChart from './TinyAreaChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, TinyAreaChart, { ClientProvider });
