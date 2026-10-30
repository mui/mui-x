import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import useTreeItemModelHook from './useTreeItemModelHook';
import ClientProvider from './client';

export default createDemo(import.meta.url, useTreeItemModelHook, { ClientProvider });
