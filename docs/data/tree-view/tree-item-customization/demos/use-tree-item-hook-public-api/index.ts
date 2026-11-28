import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import useTreeItemHookPublicAPI from './useTreeItemHookPublicAPI';
import ClientProvider from './client';

export default createDemo(import.meta.url, useTreeItemHookPublicAPI, { ClientProvider });
