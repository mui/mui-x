import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TimePickerViews from './TimePickerViews';
import ClientProvider from './client';

export default createDemo(import.meta.url, TimePickerViews, { ClientProvider });
