import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import EditLeaves from './EditLeaves';
import ClientProvider from './client';

export default createDemo(import.meta.url, EditLeaves, { ClientProvider });
