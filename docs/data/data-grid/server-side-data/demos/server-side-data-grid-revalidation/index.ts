import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideDataGridRevalidation from './ServerSideDataGridRevalidation';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideDataGridRevalidation, { ClientProvider });
