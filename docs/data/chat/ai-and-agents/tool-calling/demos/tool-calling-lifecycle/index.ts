import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ToolCallingLifecycle from './ToolCallingLifecycle';
import ClientProvider from './client';

export default createDemo(import.meta.url, ToolCallingLifecycle, { ClientProvider });
