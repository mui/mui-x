import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ZoomControlled from './ZoomControlled';
import ClientProvider from './client';

export default createDemo(import.meta.url, ZoomControlled, { ClientProvider });
