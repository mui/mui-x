import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import EditApiNoSnap from './EditApiNoSnap';
import ClientProvider from './client';

export default createDemo(import.meta.url, EditApiNoSnap, { ClientProvider });
