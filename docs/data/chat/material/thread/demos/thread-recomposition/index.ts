import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ThreadRecomposition from './ThreadRecomposition';
import ClientProvider from './client';

export default createDemo(import.meta.url, ThreadRecomposition, { ClientProvider });
