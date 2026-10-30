import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import HeadlessAPI from './HeadlessAPI';
import ClientProvider from './client';

export default createDemo(import.meta.url, HeadlessAPI, { ClientProvider });
