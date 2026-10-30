import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomHandlers from './CustomHandlers';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomHandlers, { ClientProvider });
