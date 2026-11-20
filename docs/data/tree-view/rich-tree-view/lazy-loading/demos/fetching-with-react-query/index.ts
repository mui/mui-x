import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import FetchingWithReactQuery from './FetchingWithReactQuery';
import ClientProvider from './client';

export default createDemo(import.meta.url, FetchingWithReactQuery, { ClientProvider });
