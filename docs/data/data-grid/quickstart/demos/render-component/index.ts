import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import RenderComponent from './RenderComponent';
import ClientProvider from './client';

export default createDemo(import.meta.url, RenderComponent, { ClientProvider });
