import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DefaultView from './DefaultView';
import ClientProvider from './client';

export default createDemo(import.meta.url, DefaultView, { ClientProvider });
