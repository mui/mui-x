import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TimelineDependencyEdgeCases from './TimelineDependencyEdgeCases';
import ClientProvider from './client';

export default createDemo(import.meta.url, TimelineDependencyEdgeCases, { ClientProvider });
