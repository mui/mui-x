import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomLegend from './CustomLegend';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomLegend, { ClientProvider });
