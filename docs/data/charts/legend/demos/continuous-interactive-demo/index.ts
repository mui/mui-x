import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ContinuousInteractiveDemo from './ContinuousInteractiveDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, ContinuousInteractiveDemo, { ClientProvider });
