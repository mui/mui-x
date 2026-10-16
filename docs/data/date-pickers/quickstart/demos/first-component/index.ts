import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import FirstComponent from './FirstComponent';
import ClientProvider from './client';

export default createDemo(import.meta.url, FirstComponent, { ClientProvider });
