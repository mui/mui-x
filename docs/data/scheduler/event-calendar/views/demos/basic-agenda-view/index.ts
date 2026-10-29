import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import BasicAgendaView from './BasicAgendaView';
import ClientProvider from './client';

export default createDemo(import.meta.url, BasicAgendaView, { ClientProvider });
