import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomInputComponent from './CustomInputComponent';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomInputComponent, { ClientProvider });
