import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomExport from './CustomExport';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomExport, { ClientProvider });
