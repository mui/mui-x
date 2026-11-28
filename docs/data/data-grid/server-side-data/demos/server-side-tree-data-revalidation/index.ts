import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideTreeDataRevalidation from './ServerSideTreeDataRevalidation';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideTreeDataRevalidation, { ClientProvider });
