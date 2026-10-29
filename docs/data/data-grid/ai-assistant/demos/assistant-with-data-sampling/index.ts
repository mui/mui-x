import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import AssistantWithDataSampling from './AssistantWithDataSampling';
import ClientProvider from './client';

export default createDemo(import.meta.url, AssistantWithDataSampling, { ClientProvider });
