import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomEditComponent from './CustomEditComponent';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomEditComponent, { ClientProvider });
