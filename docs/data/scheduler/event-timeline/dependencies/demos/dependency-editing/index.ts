import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DependencyEditing from './DependencyEditing';
import ClientProvider from './client';

export default createDemo(import.meta.url, DependencyEditing, { ClientProvider });
