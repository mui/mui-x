import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import CustomItem from './CustomItem';
import ClientProvider from './client';

export default createDemo(import.meta.url, CustomItem, { ClientProvider });
