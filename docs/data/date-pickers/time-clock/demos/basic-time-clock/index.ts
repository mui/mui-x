import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicTimeClock from './BasicTimeClock';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicTimeClock, { ClientProvider });
