import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SankeyOverview from './SankeyOverview';
import ClientProvider from './client';

export default createDemo(import.meta.url, SankeyOverview, { ClientProvider });
