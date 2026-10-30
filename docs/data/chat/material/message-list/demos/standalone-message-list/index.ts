import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import StandaloneMessageList from './StandaloneMessageList';
import ClientProvider from './client';

export default createDemo(import.meta.url, StandaloneMessageList, { ClientProvider });
