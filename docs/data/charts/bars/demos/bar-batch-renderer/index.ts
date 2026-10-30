import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BarBatchRenderer from './BarBatchRenderer';
import ClientProvider from './client';

export default createDemo(import.meta.url, BarBatchRenderer, { ClientProvider });
