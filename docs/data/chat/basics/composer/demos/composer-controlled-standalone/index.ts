import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ComposerControlledStandalone from './ComposerControlledStandalone';
import ClientProvider from './client';

export default createDemo(import.meta.url, ComposerControlledStandalone, { ClientProvider });
