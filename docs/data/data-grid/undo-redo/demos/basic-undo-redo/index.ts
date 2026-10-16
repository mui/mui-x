import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicUndoRedo from './BasicUndoRedo';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicUndoRedo, { ClientProvider });
