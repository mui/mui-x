import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ManualStreamAdapterDemo from './ManualStreamAdapterDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, ManualStreamAdapterDemo, { ClientProvider });
