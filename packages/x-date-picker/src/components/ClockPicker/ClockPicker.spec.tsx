import * as React from 'react';
import { ClockPicker } from '@mui/x-date-picker';

// External components are generic
<ClockPicker<Date> view="hours" date={null} onChange={(date) => date?.getDate()} />;
