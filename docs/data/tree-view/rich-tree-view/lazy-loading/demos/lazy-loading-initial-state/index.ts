import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LazyLoadingInitialState from './LazyLoadingInitialState';
import ClientProvider from './client';

export default createDemo(import.meta.url, LazyLoadingInitialState, { ClientProvider });
