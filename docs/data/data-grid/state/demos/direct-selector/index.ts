import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DirectSelector from './DirectSelector';
import ClientProvider from './client';

export default createDemo(import.meta.url, DirectSelector, { ClientProvider });
