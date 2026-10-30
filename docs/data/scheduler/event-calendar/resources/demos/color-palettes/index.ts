import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ColorPalettes from './ColorPalettes';
import ClientProvider from './client';

export default createDemo(import.meta.url, ColorPalettes, { ClientProvider });
