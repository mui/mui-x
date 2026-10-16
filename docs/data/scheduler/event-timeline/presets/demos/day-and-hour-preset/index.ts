import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DayAndHourPreset from './DayAndHourPreset';
import ClientProvider from './client';

export default createDemo(import.meta.url, DayAndHourPreset, { ClientProvider });
