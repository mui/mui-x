import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerInteraction from './ServerInteraction';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerInteraction, { ClientProvider });
