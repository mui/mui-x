import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicGroupingDemo from './BasicGroupingDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicGroupingDemo, { ClientProvider });
