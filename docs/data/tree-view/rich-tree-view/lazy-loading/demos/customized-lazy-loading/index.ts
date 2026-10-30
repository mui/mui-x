import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomizedLazyLoading from './CustomizedLazyLoading';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomizedLazyLoading, { ClientProvider });
