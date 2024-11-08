import { fireEvent, fireTouchChangedEvent, screen } from '@mui/internal-test-utils';
import { getClockTouchEvent, formatFullTimeValue } from 'test/utils/pickers';
import { MuiPickersAdapter, PickerValidDate, TimeView } from '@mui/x-date-pickers/models';
import { formatMeridiem } from '@mui/x-date-pickers/internals';

interface ViewHandler<TView> {
  setViewValue: (utils: MuiPickersAdapter, viewValue: PickerValidDate, view?: TView) => void;
}

export const timeClockHandler: ViewHandler<TimeView> = {
  setViewValue: (adapter, value, view) => {
    const hasMeridiem = adapter.is12HourCycleInCurrentLocale();

    let valueInt;
    let clockView;

    if (view === 'hours') {
      valueInt = adapter.getHours(value);
      clockView = hasMeridiem ? '12hours' : '24hours';
    } else if (view === 'minutes') {
      valueInt = adapter.getMinutes(value);
      clockView = 'minutes';
    } else {
      throw new Error('View not supported');
    }

    const hourClockEvent = getClockTouchEvent(valueInt, clockView);

    fireTouchChangedEvent(screen.getByTestId('clock'), 'touchmove', hourClockEvent);
    fireTouchChangedEvent(screen.getByTestId('clock'), 'touchend', hourClockEvent);
  },
};

export const digitalClockHandler: ViewHandler<TimeView> = {
  setViewValue: (adapter, value) => {
    fireEvent.click(screen.getByRole('option', { name: formatFullTimeValue(adapter, value) }));
  },
};

export const multiSectionDigitalClockHandler: ViewHandler<TimeView> = {
  setViewValue: (adapter, value) => {
    const hasMeridiem = adapter.is12HourCycleInCurrentLocale();
    const hoursLabel = parseInt(adapter.format(value, hasMeridiem ? 'hours12h' : 'hours24h'), 10);
    const minutesLabel = adapter.getMinutes(value).toString();
    fireEvent.click(screen.getByRole('option', { name: `${hoursLabel} hours` }));
    fireEvent.click(screen.getByRole('option', { name: `${minutesLabel} minutes` }));
    if (hasMeridiem) {
      fireEvent.click(
        screen.getByRole('option', {
          name: formatMeridiem(adapter, adapter.getHours(value) >= 12 ? 'pm' : 'am'),
        }),
      );
    }
  },
};
