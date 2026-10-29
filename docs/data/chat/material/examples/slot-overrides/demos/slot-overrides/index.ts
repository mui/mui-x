import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SlotOverrides from './SlotOverrides';
import ClientProvider from './client';

export default createDemo(import.meta.url, SlotOverrides, { ClientProvider });
