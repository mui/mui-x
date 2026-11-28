import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LazyLoadingAndAddingItems from './LazyLoadingAndAddingItems';
import ClientProvider from './client';

export default createDemo(import.meta.url, LazyLoadingAndAddingItems, { ClientProvider });
