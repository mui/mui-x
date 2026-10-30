import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ExcelCustomExport from './ExcelCustomExport';
import ClientProvider from './client';

export default createDemo(import.meta.url, ExcelCustomExport, { ClientProvider });
