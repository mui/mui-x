import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MarkdownPlayground from './MarkdownPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, MarkdownPlayground, { ClientProvider });
