import { createDemo } from '@mui/internal-core-docs/utils/createDemo';

import DateTimeRangePickerViewRenderer from './DateTimeRangePickerViewRenderer';
import ClientProvider from './client';

export default createDemo(import.meta.url, DateTimeRangePickerViewRenderer, { ClientProvider });
