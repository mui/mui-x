import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LayoutThreadOnlyStandalone from './LayoutThreadOnlyStandalone';
import ClientProvider from './client';

export default createDemo(import.meta.url, LayoutThreadOnlyStandalone, { ClientProvider });
