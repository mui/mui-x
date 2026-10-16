import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DataGridPremiumDemo from './DataGridPremiumDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, DataGridPremiumDemo, { ClientProvider });
