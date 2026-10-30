import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatBoxFeatureFlags from './ChatBoxFeatureFlags';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatBoxFeatureFlags, { ClientProvider });
