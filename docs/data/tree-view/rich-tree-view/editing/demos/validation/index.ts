import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import Validation from './Validation';
import ClientProvider from './client';

export default createDemo(import.meta.url, Validation, { ClientProvider });
