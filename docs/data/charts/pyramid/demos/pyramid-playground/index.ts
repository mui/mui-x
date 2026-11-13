import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import PyramidPlayground from './PyramidPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, PyramidPlayground, { ClientProvider });
