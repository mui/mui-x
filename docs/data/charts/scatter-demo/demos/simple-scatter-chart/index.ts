import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SimpleScatterChart from './SimpleScatterChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, SimpleScatterChart, { ClientProvider });
