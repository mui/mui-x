import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSidePivotingColumnStructureComplex from './ServerSidePivotingColumnStructureComplex';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSidePivotingColumnStructureComplex, {
  ClientProvider,
});
