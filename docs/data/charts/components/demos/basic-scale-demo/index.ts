import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicScaleDemo from './BasicScaleDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicScaleDemo, { ClientProvider });
