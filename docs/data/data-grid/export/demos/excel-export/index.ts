import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ExcelExport from './ExcelExport';
import ClientProvider from './client';

export default createDemo(import.meta.url, ExcelExport, { ClientProvider });
