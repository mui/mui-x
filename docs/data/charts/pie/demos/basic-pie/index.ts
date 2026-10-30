import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicPie from './BasicPie';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicPie, { ClientProvider });
