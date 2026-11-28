import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicCandlestick from './BasicCandlestick';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicCandlestick, { ClientProvider });
