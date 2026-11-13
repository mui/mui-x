import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SortDemo from './SortDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, SortDemo, { ClientProvider });
