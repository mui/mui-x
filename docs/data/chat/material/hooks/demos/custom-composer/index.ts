import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomComposer from './CustomComposer';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomComposer, { ClientProvider });
