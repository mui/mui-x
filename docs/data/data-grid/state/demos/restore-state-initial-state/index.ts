import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import RestoreStateInitialState from './RestoreStateInitialState';
import ClientProvider from './client';

export default createDemo(import.meta.url, RestoreStateInitialState, { ClientProvider });
