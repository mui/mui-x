import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatConfirmationPlayground from './ChatConfirmationPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatConfirmationPlayground, { ClientProvider });
