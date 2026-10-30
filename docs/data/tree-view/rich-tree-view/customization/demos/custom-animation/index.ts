import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomAnimation from './CustomAnimation';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomAnimation, { ClientProvider });
