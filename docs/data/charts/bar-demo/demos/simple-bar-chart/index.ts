import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SimpleBarChart from './SimpleBarChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, SimpleBarChart, { ClientProvider });
