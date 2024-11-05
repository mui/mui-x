import * as React from 'react';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

<PickersDay
  day={new Date()}
  outsideCurrentMonth
  onDaySelect={() => {}}
  isFirstVisibleCell={false}
  isLastVisibleCell={false}
/>;
