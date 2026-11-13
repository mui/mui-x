import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import LazyLoadingAndLabelEditing from './LazyLoadingAndLabelEditing';
import ClientProvider from './client';

export default createDemo(import.meta.url, LazyLoadingAndLabelEditing, { ClientProvider });
