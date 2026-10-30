import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import PopularFeaturesDemo from './PopularFeaturesDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, PopularFeaturesDemo, { ClientProvider });
