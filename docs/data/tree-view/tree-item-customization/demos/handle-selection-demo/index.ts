import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import HandleSelectionDemo from './HandleSelectionDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, HandleSelectionDemo, { ClientProvider });
