import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ControlledStateHeadlessChat from './ControlledStateHeadlessChat';
import ClientProvider from './client';

export default createDemo(import.meta.url, ControlledStateHeadlessChat, { ClientProvider });
