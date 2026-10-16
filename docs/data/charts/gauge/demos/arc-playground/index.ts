import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ArcPlayground from './ArcPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ArcPlayground, { ClientProvider });
