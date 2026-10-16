import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomLabels from './CustomLabels';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomLabels, { ClientProvider });
