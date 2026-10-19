import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import EchoAdapterDemo from './EchoAdapterDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, EchoAdapterDemo, { ClientProvider });
