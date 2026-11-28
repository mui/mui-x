import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LazyLoadingGrid from './LazyLoadingGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, LazyLoadingGrid, { ClientProvider });
