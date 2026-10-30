import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomGeneralTab from './CustomGeneralTab';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomGeneralTab, { ClientProvider });
