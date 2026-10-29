import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CSSCustomization from './CSSCustomization';
import ClientProvider from './client';

export default createDemo(import.meta.url, CSSCustomization, { ClientProvider });
