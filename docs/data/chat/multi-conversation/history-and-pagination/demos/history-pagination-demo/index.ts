import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import HistoryPaginationDemo from './HistoryPaginationDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, HistoryPaginationDemo, { ClientProvider });
