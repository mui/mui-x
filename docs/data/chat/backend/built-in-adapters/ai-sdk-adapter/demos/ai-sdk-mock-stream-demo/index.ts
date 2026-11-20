import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AiSdkMockStreamDemo from './AiSdkMockStreamDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, AiSdkMockStreamDemo, { ClientProvider });
