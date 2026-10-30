import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SyncTooltip from './SyncTooltip';
import ClientProvider from './client';

export default createDemo(import.meta.url, SyncTooltip, { ClientProvider });
