import * as React from 'react';
import moment, { Moment } from 'moment';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';

// External components are generic as well
<CalendarPicker<Moment>
  view="day"
  views={['day']}
  value={moment()}
  minDate={moment()}
  maxDate={moment()}
  onChange={(date) => date?.format()}
/>;
