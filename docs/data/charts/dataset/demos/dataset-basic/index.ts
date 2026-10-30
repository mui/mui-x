import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DatasetBasic from './DatasetBasic';
import ClientProvider from './client';

export default createDemo(import.meta.url, DatasetBasic, { ClientProvider });
