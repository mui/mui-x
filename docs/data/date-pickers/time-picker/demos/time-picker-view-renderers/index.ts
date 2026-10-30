import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import TimePickerViewRenderers from './TimePickerViewRenderers';
import ClientProvider from './client';

export default createDemo(import.meta.url, TimePickerViewRenderers, { ClientProvider });
