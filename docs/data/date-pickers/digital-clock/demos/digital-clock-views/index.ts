import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DigitalClockViews from './DigitalClockViews';
import ClientProvider from './client';

export default createDemo(import.meta.url, DigitalClockViews, { ClientProvider });
