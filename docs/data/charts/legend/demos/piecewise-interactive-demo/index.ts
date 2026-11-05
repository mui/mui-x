import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import PiecewiseInteractiveDemo from './PiecewiseInteractiveDemo';
import ClientProvider from './client';

export default createDemo(import.meta.url, PiecewiseInteractiveDemo, { ClientProvider });
