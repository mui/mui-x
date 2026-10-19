import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AdapterMomentJalali from './AdapterMomentJalali';
import ClientProvider from './client';

export default createDemo(import.meta.url, AdapterMomentJalali, { ClientProvider });
