import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import StepTrackingDemo from './StepTrackingDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, StepTrackingDemo, { ClientProvider });
