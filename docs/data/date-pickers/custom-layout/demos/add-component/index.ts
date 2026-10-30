import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AddComponent from './AddComponent';
import ClientProvider from './client';

export default createDemo(import.meta.url, AddComponent, { ClientProvider });
