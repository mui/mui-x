import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SingleClickEditing from './SingleClickEditing';
import ClientProvider from './client';

export default createDemo(import.meta.url, SingleClickEditing, { ClientProvider });
