import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MessageVariantsDemo from './MessageVariantsDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, MessageVariantsDemo, { ClientProvider });
