import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import FullFeaturedDemo from './FullFeaturedDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, FullFeaturedDemo, { ClientProvider });
