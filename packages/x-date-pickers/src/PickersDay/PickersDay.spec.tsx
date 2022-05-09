import * as React from 'react';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

<PickersDay<Date> day={new Date()} outsideCurrentMonth onDaySelect={(date) => date?.getDay()} />;
