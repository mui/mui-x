import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicArea from './BasicArea';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicArea, { ClientProvider });
