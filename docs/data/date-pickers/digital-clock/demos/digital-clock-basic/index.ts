import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DigitalClockBasic from './DigitalClockBasic';
import ClientProvider from './client';

export default createDemo(import.meta.url, DigitalClockBasic, { ClientProvider });
