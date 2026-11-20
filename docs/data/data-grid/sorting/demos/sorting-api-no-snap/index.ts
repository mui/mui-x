import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SortingApiNoSnap from './SortingApiNoSnap';
import ClientProvider from './client';

export default createDemo(import.meta.url, SortingApiNoSnap, { ClientProvider });
