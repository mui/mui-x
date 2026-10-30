import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ColorConfig from './ColorConfig';
import ClientProvider from './client';

export default createDemo(import.meta.url, ColorConfig, { ClientProvider });
