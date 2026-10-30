import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import MuiDocsAssistantDemo from './MuiDocsAssistantDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, MuiDocsAssistantDemo, { ClientProvider });
