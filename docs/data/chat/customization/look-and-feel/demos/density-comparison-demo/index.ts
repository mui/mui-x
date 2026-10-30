import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DensityComparisonDemo from './DensityComparisonDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, DensityComparisonDemo, { ClientProvider });
