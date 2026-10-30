import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DataGridDemo from './DataGridDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, DataGridDemo, { ClientProvider });
