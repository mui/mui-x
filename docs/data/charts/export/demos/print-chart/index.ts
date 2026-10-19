import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import PrintChart from './PrintChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, PrintChart, { ClientProvider });
