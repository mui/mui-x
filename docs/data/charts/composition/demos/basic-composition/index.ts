import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicComposition from './BasicComposition';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicComposition, { ClientProvider });
