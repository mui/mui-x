import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import EditingCallback from './EditingCallback';
import ClientProvider from './client';

export default createDemo(import.meta.url, EditingCallback, { ClientProvider });
