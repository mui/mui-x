import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ComposerVariantsDemo from './ComposerVariantsDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, ComposerVariantsDemo, { ClientProvider });
