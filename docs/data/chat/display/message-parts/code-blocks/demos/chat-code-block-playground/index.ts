import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatCodeBlockPlayground from './ChatCodeBlockPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatCodeBlockPlayground, { ClientProvider });
