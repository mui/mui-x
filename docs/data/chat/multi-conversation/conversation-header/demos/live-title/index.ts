import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LiveTitle from './LiveTitle';
import ClientProvider from './client';

export default createDemo(import.meta.url, LiveTitle, { ClientProvider });
