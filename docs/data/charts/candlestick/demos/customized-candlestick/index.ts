import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomizedCandlestick from './CustomizedCandlestick';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomizedCandlestick, { ClientProvider });
