import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import RecurringEventsStressTest from './RecurringEventsStressTest';
import ClientProvider from './client';

export default createDemo(import.meta.url, RecurringEventsStressTest, { ClientProvider });
