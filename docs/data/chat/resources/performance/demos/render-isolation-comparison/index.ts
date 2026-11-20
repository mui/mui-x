import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import RenderIsolationComparison from './RenderIsolationComparison';
import ClientProvider from './client';

export default createDemo(import.meta.url, RenderIsolationComparison, { ClientProvider });
