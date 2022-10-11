import * as React from 'react';
import moment, { Moment } from 'moment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// External components are generic as well
<DateCalendar<Moment>
  view="day"
  views={['day']}
  value={moment()}
  minDate={moment()}
  maxDate={moment()}
  onChange={(date) => date?.format()}
/>;
