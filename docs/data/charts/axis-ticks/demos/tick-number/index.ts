import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TickNumber from './TickNumber';
import ClientProvider from './client';

export default createDemo(import.meta.url, TickNumber, { ClientProvider });
