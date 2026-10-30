import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DemoRadar from './DemoRadar';
import ClientProvider from './client';

export default createDemo(import.meta.url, DemoRadar, { ClientProvider });
