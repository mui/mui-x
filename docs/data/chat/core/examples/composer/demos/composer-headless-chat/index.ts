import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ComposerHeadlessChat from './ComposerHeadlessChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, ComposerHeadlessChat, { ClientProvider });
