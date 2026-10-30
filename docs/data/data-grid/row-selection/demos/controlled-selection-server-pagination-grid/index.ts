import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ControlledSelectionServerPaginationGrid from './ControlledSelectionServerPaginationGrid';
import ClientProvider from './client';

export default createDemo(import.meta.url, ControlledSelectionServerPaginationGrid, {
  ClientProvider,
});
