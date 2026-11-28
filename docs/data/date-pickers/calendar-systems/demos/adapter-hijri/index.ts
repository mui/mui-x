import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AdapterHijri from './AdapterHijri';
import ClientProvider from './client';

export default createDemo(import.meta.url, AdapterHijri, { ClientProvider });
