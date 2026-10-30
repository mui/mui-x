import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import SourcePartsDemo from './SourcePartsDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, SourcePartsDemo, { ClientProvider });
