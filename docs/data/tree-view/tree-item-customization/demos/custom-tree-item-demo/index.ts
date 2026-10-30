import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomTreeItemDemo from './CustomTreeItemDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomTreeItemDemo, { ClientProvider });
