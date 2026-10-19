import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import Interaction from './Interaction';
import ClientProvider from './client';

export default createDemo(import.meta.url, Interaction, { ClientProvider });
