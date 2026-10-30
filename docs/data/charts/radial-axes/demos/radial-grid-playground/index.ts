import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import RadialGridPlayground from './RadialGridPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, RadialGridPlayground, { ClientProvider });
