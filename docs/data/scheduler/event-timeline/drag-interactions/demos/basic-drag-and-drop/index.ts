import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicDragAndDrop from './BasicDragAndDrop';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicDragAndDrop, { ClientProvider });
