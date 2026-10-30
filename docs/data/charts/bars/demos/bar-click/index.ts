import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BarClick from './BarClick';
import ClientProvider from './client';

export default createDemo(import.meta.url, BarClick, { ClientProvider });
