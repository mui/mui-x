import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ExcelExportWithWebWorker from './ExcelExportWithWebWorker';
import ClientProvider from './client';

export default createDemo(import.meta.url, ExcelExportWithWebWorker, { ClientProvider });
