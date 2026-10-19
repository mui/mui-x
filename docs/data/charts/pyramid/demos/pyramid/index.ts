import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import Pyramid from './Pyramid';
import ClientProvider from './client';

export default createDemo(import.meta.url, Pyramid, { ClientProvider });
