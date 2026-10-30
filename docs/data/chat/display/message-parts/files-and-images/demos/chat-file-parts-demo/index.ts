import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ChatFilePartsDemo from './ChatFilePartsDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, ChatFilePartsDemo, { ClientProvider });
