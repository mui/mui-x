import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DemoRadarVisualisation from './DemoRadarVisualisation';
import ClientProvider from './client';

export default createDemo(import.meta.url, DemoRadarVisualisation, { ClientProvider });
