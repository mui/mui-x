import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatComposerPlayground from './ChatComposerPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatComposerPlayground, { ClientProvider });
