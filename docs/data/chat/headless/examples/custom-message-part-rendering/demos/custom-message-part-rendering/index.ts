import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomMessagePartRendering from './CustomMessagePartRendering';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomMessagePartRendering, { ClientProvider });
