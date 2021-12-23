import * as React from 'react';
import { PickersDay } from '@mui/x-pickers/PickersDay';

<PickersDay<Date>
  day={new Date()}
  allowSameDateSelection
  outsideCurrentMonth
  onDaySelect={(date) => date?.getDay()}
/>;
