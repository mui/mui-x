import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomizationDemo from './CustomizationDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomizationDemo, { ClientProvider });
