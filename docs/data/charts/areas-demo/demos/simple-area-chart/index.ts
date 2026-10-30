import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SimpleAreaChart from './SimpleAreaChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, SimpleAreaChart, { ClientProvider });
