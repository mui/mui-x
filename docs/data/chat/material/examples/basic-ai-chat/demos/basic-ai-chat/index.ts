import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicAiChat from './BasicAiChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicAiChat, { ClientProvider });
