import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TailwindChatDemo from './TailwindChatDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, TailwindChatDemo, { ClientProvider });
