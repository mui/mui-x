import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DataGridProDemo from './DataGridProDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, DataGridProDemo, { ClientProvider });
