import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TimeClockViews from './TimeClockViews';
import ClientProvider from './client';

export default createDemo(import.meta.url, TimeClockViews, { ClientProvider });
