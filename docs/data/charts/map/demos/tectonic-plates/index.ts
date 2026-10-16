import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TectonicPlates from './TectonicPlates';
import ClientProvider from './client';

export default createDemo(import.meta.url, TectonicPlates, { ClientProvider });
