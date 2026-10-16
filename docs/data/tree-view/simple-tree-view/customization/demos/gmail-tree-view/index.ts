import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import GmailTreeView from './GmailTreeView';
import ClientProvider from './client';

export default createDemo(import.meta.url, GmailTreeView, { ClientProvider });
