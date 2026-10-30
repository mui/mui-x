import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MarsMap from './MarsMap';
import ClientProvider from './client';

export default createDemo(import.meta.url, MarsMap, { ClientProvider });
