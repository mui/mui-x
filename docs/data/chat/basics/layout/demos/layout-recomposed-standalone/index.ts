import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LayoutRecomposedStandalone from './LayoutRecomposedStandalone';
import ClientProvider from './client';

export default createDemo(import.meta.url, LayoutRecomposedStandalone, { ClientProvider });
