import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomValidation from './CustomValidation';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomValidation, { ClientProvider });
