import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicLazyLoading from './BasicLazyLoading';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicLazyLoading, { ClientProvider });
