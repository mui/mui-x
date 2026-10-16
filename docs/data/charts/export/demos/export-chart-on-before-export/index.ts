import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ExportChartOnBeforeExport from './ExportChartOnBeforeExport';
import ClientProvider from './client';

export default createDemo(import.meta.url, ExportChartOnBeforeExport, { ClientProvider });
