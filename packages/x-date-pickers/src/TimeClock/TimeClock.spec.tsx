import * as React from 'react';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

// External components are generic
<TimeClock view="hours" value={null} onChange={(date) => date?.getDate()} />;
