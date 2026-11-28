import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ComplexSankeyChart from './ComplexSankeyChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, ComplexSankeyChart, { ClientProvider });
