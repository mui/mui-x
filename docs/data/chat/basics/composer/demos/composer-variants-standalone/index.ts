import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ComposerVariantsStandalone from './ComposerVariantsStandalone';
import ClientProvider from './client';

export default createDemo(import.meta.url, ComposerVariantsStandalone, { ClientProvider });
