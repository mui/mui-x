import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ReasoningStreamingDemo from './ReasoningStreamingDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, ReasoningStreamingDemo, { ClientProvider });
