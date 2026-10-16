import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ModelSelector from './ModelSelector';
import ClientProvider from './client';

export default createDemo(import.meta.url, ModelSelector, { ClientProvider });
