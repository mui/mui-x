import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ExportServerSideData from './ExportServerSideData';
import ClientProvider from './client';

export default createDemo(import.meta.url, ExportServerSideData, { ClientProvider });
