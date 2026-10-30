import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomScatter from './CustomScatter';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomScatter, { ClientProvider });
