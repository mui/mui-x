import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LineOverview from './LineOverview';
import ClientProvider from './client';

export default createDemo(import.meta.url, LineOverview, { ClientProvider });
