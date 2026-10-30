import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSidePivotingColumnStructureSimple from './ServerSidePivotingColumnStructureSimple';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSidePivotingColumnStructureSimple, {
  ClientProvider,
});
