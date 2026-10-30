import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import FormatterDemo from './FormatterDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, FormatterDemo, { ClientProvider });
