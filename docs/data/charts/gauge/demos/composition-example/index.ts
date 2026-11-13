import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CompositionExample from './CompositionExample';
import ClientProvider from './client';

export default createDemo(import.meta.url, CompositionExample, { ClientProvider });
