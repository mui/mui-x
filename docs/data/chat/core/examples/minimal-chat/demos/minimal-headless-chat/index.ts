import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MinimalHeadlessChat from './MinimalHeadlessChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, MinimalHeadlessChat, { ClientProvider });
