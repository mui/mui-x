import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomSlots from './CustomSlots';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomSlots, { ClientProvider });
