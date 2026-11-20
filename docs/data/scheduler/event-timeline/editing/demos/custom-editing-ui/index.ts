import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomEditingUI from './CustomEditingUI';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomEditingUI, { ClientProvider });
