import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import OriginDemo from './OriginDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, OriginDemo, { ClientProvider });
