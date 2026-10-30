import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import HeatmapCellClick from './HeatmapCellClick';
import ClientProvider from './client';

export default createDemo(import.meta.url, HeatmapCellClick, { ClientProvider });
