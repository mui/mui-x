import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomTheme from './CustomTheme';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomTheme, { ClientProvider });
