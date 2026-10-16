import { createDemo } from '@mui/internal-core-docs/utils/createDemo';
import ErrorDecoder from './ErrorDecoder';
import ClientProvider from './client';

export default createDemo(import.meta.url, ErrorDecoder, { ClientProvider });
