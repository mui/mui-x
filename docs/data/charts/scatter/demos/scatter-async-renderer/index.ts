import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ScatterAsyncRenderer from './ScatterAsyncRenderer';
import ClientProvider from './client';

export default createDemo(import.meta.url, ScatterAsyncRenderer, { ClientProvider });
