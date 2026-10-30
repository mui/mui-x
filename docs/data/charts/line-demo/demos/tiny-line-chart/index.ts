import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TinyLineChart from './TinyLineChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, TinyLineChart, { ClientProvider });
