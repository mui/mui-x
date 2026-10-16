import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicDataSource from './BasicDataSource';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicDataSource, { ClientProvider });
