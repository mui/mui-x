import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomLocaleOverlay from './CustomLocaleOverlay';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomLocaleOverlay, { ClientProvider });
