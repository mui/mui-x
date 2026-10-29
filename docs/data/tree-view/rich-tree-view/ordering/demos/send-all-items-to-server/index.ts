import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SendAllItemsToServer from './SendAllItemsToServer';
import ClientProvider from './client';

export default createDemo(import.meta.url, SendAllItemsToServer, { ClientProvider });
