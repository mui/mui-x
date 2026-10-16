import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicBars from './BasicBars';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicBars, { ClientProvider });
