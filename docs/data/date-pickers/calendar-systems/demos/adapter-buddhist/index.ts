import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AdapterBuddhist from './AdapterBuddhist';
import ClientProvider from './client';

export default createDemo(import.meta.url, AdapterBuddhist, { ClientProvider });
