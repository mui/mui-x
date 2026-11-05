import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DragAndDrop from './DragAndDrop';
import ClientProvider from './client';

export default createDemo(import.meta.url, DragAndDrop, { ClientProvider });
