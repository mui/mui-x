import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SankeyClick from './SankeyClick';
import ClientProvider from './client';

export default createDemo(import.meta.url, SankeyClick, { ClientProvider });
