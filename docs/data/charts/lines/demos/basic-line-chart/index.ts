import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicLineChart from './BasicLineChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicLineChart, { ClientProvider });
