import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import StackOffsetDemo from './StackOffsetDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, StackOffsetDemo, { ClientProvider });
