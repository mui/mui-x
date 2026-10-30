import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import WebGLBars from './WebGLBars';
import ClientProvider from './client';

export default createDemo(import.meta.url, WebGLBars, { ClientProvider });
