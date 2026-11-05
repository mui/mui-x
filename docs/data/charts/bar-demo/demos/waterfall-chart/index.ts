import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import WaterfallChart from './WaterfallChart';
import ClientProvider from './client';

export default createDemo(import.meta.url, WaterfallChart, { ClientProvider });
