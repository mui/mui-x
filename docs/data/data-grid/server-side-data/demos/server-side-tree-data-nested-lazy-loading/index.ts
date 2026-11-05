import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ServerSideTreeDataNestedLazyLoading from './ServerSideTreeDataNestedLazyLoading';
import ClientProvider from './client';

export default createDemo(import.meta.url, ServerSideTreeDataNestedLazyLoading, { ClientProvider });
