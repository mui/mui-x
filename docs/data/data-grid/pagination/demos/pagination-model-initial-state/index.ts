import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import PaginationModelInitialState from './PaginationModelInitialState';
import ClientProvider from './client';

export default createDemo(import.meta.url, PaginationModelInitialState, { ClientProvider });
