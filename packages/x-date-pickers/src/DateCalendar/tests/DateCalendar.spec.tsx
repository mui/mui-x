import * as React from 'react';
import moment from 'moment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateCalendar />;

<DateCalendar defaultValue={new Date()} />;

<DateCalendar value={new Date()} />;

<DateCalendar value={null} />;

// External components are generic as well
<DateCalendar
  view="day"
  views={['day']}
  value={moment()}
  minDate={moment()}
  maxDate={moment()}
  onChange={(date) => date?.format()}
/>;
