import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomStyling from './CustomStyling';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomStyling, { ClientProvider });
