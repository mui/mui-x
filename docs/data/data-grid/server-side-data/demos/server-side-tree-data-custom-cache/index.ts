import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideTreeDataCustomCache from './ServerSideTreeDataCustomCache';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideTreeDataCustomCache, { ClientProvider });
