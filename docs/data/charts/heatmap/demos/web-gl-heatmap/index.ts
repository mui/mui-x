import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import WebGLHeatmap from './WebGLHeatmap';
import ClientProvider from './client';

export default createDemo(import.meta.url, WebGLHeatmap, { ClientProvider });
