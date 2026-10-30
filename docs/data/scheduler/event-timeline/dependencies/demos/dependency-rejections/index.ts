import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DependencyRejections from './DependencyRejections';
import ClientProvider from './client';

export default createDemo(import.meta.url, DependencyRejections, { ClientProvider });
