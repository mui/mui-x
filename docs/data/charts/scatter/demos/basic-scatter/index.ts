import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicScatter from './BasicScatter';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicScatter, { ClientProvider });
