import { act, fireTouchChangedEvent, screen, MuiRenderResult } from '@mui/internal-test-utils';
import { getClockTouchEvent, formatFullTimeValue } from 'test/utils/pickers';
import { MuiPickersAdapter, PickerValidDate, TimeView } from '@mui/x-date-pickers/models';
import { formatMeridiem } from '@mui/x-date-pickers/internals';

interface ViewHandler<TView> {
  setViewValue: (
    user: MuiRenderResult['user'],
    adapter: MuiPickersAdapter,
    viewValue: PickerValidDate,
    view?: TView,
  ) => Promise<void>;
}

export const timeClockHandler: ViewHandler<TimeView> = {
  setViewValue: async (_, adapter, value, view) => {
    const hasMeridiem = adapter.is12HourCycleInCurrentLocale();

    let valueInt;
    let clockView: 'minutes' | '12hours' | '24hours';

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

    await act(async () => {
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchmove', hourClockEvent);
    });
    await act(async () => {
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchend', hourClockEvent);
    });
  },
};

export const digitalClockHandler: ViewHandler<TimeView> = {
  setViewValue: async (user, adapter, value) => {
    await user.click(screen.getByRole('option', { name: formatFullTimeValue(adapter, value) }));
  },
};

export const multiSectionDigitalClockHandler: ViewHandler<TimeView> = {
  setViewValue: async (user, adapter, value) => {
    const hasMeridiem = adapter.is12HourCycleInCurrentLocale();
    const hoursLabel = parseInt(adapter.format(value, hasMeridiem ? 'hours12h' : 'hours24h'), 10);
    const minutesLabel = adapter.getMinutes(value).toString();
    await user.click(screen.getByRole('option', { name: `${hoursLabel} hours` }));
    await user.click(screen.getByRole('option', { name: `${minutesLabel} minutes` }));
    if (hasMeridiem) {
      await user.click(
        screen.getByRole('option', {
          name: formatMeridiem(adapter, adapter.getHours(value) >= 12 ? 'pm' : 'am'),
        }),
      );
    }
  },
};
