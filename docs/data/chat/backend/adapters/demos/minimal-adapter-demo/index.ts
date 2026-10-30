import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MinimalAdapterDemo from './MinimalAdapterDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, MinimalAdapterDemo, { ClientProvider });
