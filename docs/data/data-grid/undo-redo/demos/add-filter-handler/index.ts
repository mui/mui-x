import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AddFilterHandler from './AddFilterHandler';
import ClientProvider from './client';

export default createDemo(import.meta.url, AddFilterHandler, { ClientProvider });
