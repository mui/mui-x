import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ScatterWebGLRenderer from './ScatterWebGLRenderer';
import ClientProvider from './client';

export default createDemo(import.meta.url, ScatterWebGLRenderer, { ClientProvider });
