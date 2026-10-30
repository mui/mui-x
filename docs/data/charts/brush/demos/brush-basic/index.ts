import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BrushBasic from './BrushBasic';
import ClientProvider from './client';

export default createDemo(import.meta.url, BrushBasic, { ClientProvider });
