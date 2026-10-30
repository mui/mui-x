import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MessageStatesDemo from './MessageStatesDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, MessageStatesDemo, { ClientProvider });
