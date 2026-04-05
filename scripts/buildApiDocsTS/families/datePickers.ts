import type { ProductFamily } from '../config';

export const datePickersFamily: ProductFamily = {
  section: 'date-pickers',
  packages: ['x-date-pickers', 'x-date-pickers-pro'],
  includeUnstable: true,
  unresolvedProps: [
    'value',
    'defaultValue',
    'minDate',
    'maxDate',
    'minDateTime',
    'maxDateTime',
    'minTime',
    'maxTime',
    'referenceDate',
    'day',
    'currentMonth',
    'month',
    'fieldRef',
    'startFieldRef',
    'endFieldRef',
  ],
};
