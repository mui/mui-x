import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BubbleChartCO2Emissions from './BubbleChartCO2Emissions';
import ClientProvider from './client';

export default createDemo(import.meta.url, BubbleChartCO2Emissions, { ClientProvider });
