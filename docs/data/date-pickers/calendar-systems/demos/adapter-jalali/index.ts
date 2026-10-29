import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AdapterJalali from './AdapterJalali';
import ClientProvider from './client';

export default createDemo(import.meta.url, AdapterJalali, { ClientProvider });
