import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import InterpolationDemo from './InterpolationDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, InterpolationDemo, { ClientProvider });
