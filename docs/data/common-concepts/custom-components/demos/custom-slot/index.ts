import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomSlot from './CustomSlot';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomSlot, { ClientProvider });
