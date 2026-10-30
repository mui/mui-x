import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DependencyLag from './DependencyLag';
import ClientProvider from './client';

export default createDemo(import.meta.url, DependencyLag, { ClientProvider });
