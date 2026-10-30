import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MinMaxExample from './MinMaxExample';
import ClientProvider from './client';

export default createDemo(import.meta.url, MinMaxExample, { ClientProvider });
