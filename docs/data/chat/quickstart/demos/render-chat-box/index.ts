import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import RenderChatBox from './RenderChatBox';
import ClientProvider from './client';

export default createDemo(import.meta.url, RenderChatBox, { ClientProvider });
