import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatComposerAttachmentListPlayground from './ChatComposerAttachmentListPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatComposerAttachmentListPlayground, {
  ClientProvider,
});
