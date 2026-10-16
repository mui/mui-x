import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ScatterCSSSelectors from './ScatterCSSSelectors';
import ClientProvider from './client';

export default createDemo(import.meta.url, ScatterCSSSelectors, { ClientProvider });
