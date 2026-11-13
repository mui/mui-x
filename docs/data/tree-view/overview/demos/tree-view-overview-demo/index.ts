import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TreeViewOverviewDemo from './TreeViewOverviewDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, TreeViewOverviewDemo, { ClientProvider });
