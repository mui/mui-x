import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SeriesDemo from './SeriesDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, SeriesDemo, { ClientProvider });
