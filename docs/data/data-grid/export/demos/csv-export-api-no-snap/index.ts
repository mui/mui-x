import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CsvExportApiNoSnap from './CsvExportApiNoSnap';
import ClientProvider from './client';

export default createDemo(import.meta.url, CsvExportApiNoSnap, { ClientProvider });
