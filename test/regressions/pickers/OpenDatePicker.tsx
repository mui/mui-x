import * as React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const adapterToUse = new AdapterDateFns();

const NoTransition = React.forwardRef(function NoTransition(
  props: TransitionProps & { children?: React.ReactNode },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, in: inProp } = props;

  if (!inProp) {
    return null;
  }
  return (
    <div ref={ref} tabIndex={-1}>
      {children}
    </div>
  );
});

export default function OpenDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        open
        slots={{
          desktopTransition: NoTransition,
        }}
        slotProps={{
          popper: {
            // @ts-expect-error
            'data-testid': 'screenshot-target',
          },
        }}
        value={adapterToUse.date('2019-01-01T00:00:00.000')}
      />
    </LocalizationProvider>
  );
}
