import * as React from 'react';
import { PickersDay } from '@mui/x-date-picker';

<PickersDay<Date>
  day={new Date()}
  allowSameDateSelection
  outsideCurrentMonth
  onDaySelect={(date) => date?.getDay()}
/>;
