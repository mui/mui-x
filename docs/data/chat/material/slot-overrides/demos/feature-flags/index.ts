import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import FeatureFlags from './FeatureFlags';
import ClientProvider from './client';

export default createDemo(import.meta.url, FeatureFlags, { ClientProvider });
