import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import StreamingMarkdown from './StreamingMarkdown';
import ClientProvider from './client';

export default createDemo(import.meta.url, StreamingMarkdown, { ClientProvider });
