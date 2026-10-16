import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TextPlayground from './TextPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, TextPlayground, { ClientProvider });
