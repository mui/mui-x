import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import GridDemo from './GridDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, GridDemo, { ClientProvider });
