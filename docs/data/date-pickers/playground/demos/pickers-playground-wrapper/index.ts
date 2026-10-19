import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import PickersPlaygroundWrapper from './PickersPlaygroundWrapper';
import ClientProvider from './client';

export default createDemo(import.meta.url, PickersPlaygroundWrapper, { ClientProvider });
