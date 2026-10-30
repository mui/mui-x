import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import ColumnPinningApiNoSnap from './ColumnPinningApiNoSnap';
import ClientProvider from './client';

export default createDemo(import.meta.url, ColumnPinningApiNoSnap, { ClientProvider });
