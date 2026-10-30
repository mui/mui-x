import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import HooksHeadlessChat from './HooksHeadlessChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, HooksHeadlessChat, { ClientProvider });
