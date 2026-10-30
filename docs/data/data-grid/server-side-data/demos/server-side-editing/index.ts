import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideEditing from './ServerSideEditing';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideEditing, { ClientProvider });
