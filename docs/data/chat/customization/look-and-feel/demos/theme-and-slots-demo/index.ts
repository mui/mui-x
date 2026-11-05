import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ThemeAndSlotsDemo from './ThemeAndSlotsDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, ThemeAndSlotsDemo, { ClientProvider });
