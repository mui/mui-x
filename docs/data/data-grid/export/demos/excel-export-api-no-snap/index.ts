import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ExcelExportApiNoSnap from './ExcelExportApiNoSnap';
import ClientProvider from './client';

export default createDemo(import.meta.url, ExcelExportApiNoSnap, { ClientProvider });
