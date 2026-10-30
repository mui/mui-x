import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ColorTemplate from './ColorTemplate';
import ClientProvider from './client';

export default createDemo(import.meta.url, ColorTemplate, { ClientProvider });
