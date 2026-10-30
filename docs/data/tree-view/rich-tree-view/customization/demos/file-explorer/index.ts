import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import FileExplorer from './FileExplorer';
import ClientProvider from './client';

export default createDemo(import.meta.url, FileExplorer, { ClientProvider });
