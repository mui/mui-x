import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LazyLoadingDetailPanel from './LazyLoadingDetailPanel';
import ClientProvider from './client';

export default createDemo(import.meta.url, LazyLoadingDetailPanel, { ClientProvider });
