import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LookAndFeelPlayground from './LookAndFeelPlayground';
import ClientProvider from './client';

export default createDemo(import.meta.url, LookAndFeelPlayground, { ClientProvider });
