import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ComposerControlled from './ComposerControlled';
import ClientProvider from './client';

export default createDemo(import.meta.url, ComposerControlled, { ClientProvider });
