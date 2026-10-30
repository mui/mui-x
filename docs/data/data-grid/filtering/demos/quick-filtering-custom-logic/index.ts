import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import QuickFilteringCustomLogic from './QuickFilteringCustomLogic';
import ClientProvider from './client';

export default createDemo(import.meta.url, QuickFilteringCustomLogic, { ClientProvider });
