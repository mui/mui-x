import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SimpleCharts from './SimpleCharts';
import ClientProvider from './client';

export default createDemo(import.meta.url, SimpleCharts, { ClientProvider });
