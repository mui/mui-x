import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import FilterApiNoSnap from './FilterApiNoSnap';
import ClientProvider from './client';

export default createDemo(import.meta.url, FilterApiNoSnap, { ClientProvider });
