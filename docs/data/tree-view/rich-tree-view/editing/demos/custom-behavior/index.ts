import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomBehavior from './CustomBehavior';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomBehavior, { ClientProvider });
