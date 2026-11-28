import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import PickerDayDemoCustomTheme from './PickerDayDemoCustomTheme';
import ClientProvider from './client';

export default createDemo(import.meta.url, PickerDayDemoCustomTheme, { ClientProvider });
