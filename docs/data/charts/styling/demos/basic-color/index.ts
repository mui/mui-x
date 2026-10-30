import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicColor from './BasicColor';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicColor, { ClientProvider });
