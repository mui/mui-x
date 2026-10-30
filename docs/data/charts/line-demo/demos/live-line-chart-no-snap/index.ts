import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LiveLineChartNoSnap from './LiveLineChartNoSnap';
import ClientProvider from './client';

export default createDemo(import.meta.url, LiveLineChartNoSnap, { ClientProvider });
