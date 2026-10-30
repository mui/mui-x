import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TitanicPie from './TitanicPie';
import ClientProvider from './client';

export default createDemo(import.meta.url, TitanicPie, { ClientProvider });
