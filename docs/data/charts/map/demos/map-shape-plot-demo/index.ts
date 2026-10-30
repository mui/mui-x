import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MapShapePlotDemo from './MapShapePlotDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, MapShapePlotDemo, { ClientProvider });
