import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ExternalDragAndDrop from './ExternalDragAndDrop';
import ClientProvider from './client';

export default createDemo(import.meta.url, ExternalDragAndDrop, { ClientProvider });
