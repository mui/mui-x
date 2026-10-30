import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SeriesValueGetter from './SeriesValueGetter';
import ClientProvider from './client';

export default createDemo(import.meta.url, SeriesValueGetter, { ClientProvider });
