import sinon from 'sinon';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { PickerComponentFamily } from '@mui/x-date-pickers/tests/describe.types';
import { OpenPickerParams } from './openPicker';

export const stubMatchMedia = (matches = true) =>
  sinon.stub().returns({
    matches,
    addListener: () => {},
    removeListener: () => {},
  });

const getChangeCountForComponentFamily = (componentFamily: PickerComponentFamily) => {
  switch (componentFamily) {
    case 'clock':
    case 'multi-section-digital-clock':
      return 3;
    default:
      return 1;
  }
};

export const getExpectedOnChangeCount = (
  componentFamily: PickerComponentFamily,
  params: OpenPickerParams,
) => {
  if (componentFamily === 'digital-clock') {
    return getChangeCountForComponentFamily(componentFamily);
  }
  if (params.type === 'date-time') {
    return (
      getChangeCountForComponentFamily(componentFamily) +
      getChangeCountForComponentFamily(
        params.variant === 'desktop' ? 'multi-section-digital-clock' : 'clock',
      )
    );
  }
  if (componentFamily === 'picker' && params.type === 'time') {
    return getChangeCountForComponentFamily(
      params.variant === 'desktop' ? 'multi-section-digital-clock' : 'clock',
    );
  }
  if (componentFamily === 'clock') {
    // the `TimeClock` fires change for both touch move and touch end
    // but does not have meridiem control
    return (getChangeCountForComponentFamily(componentFamily) - 1) * 2;
  }
  return getChangeCountForComponentFamily(componentFamily);
};

export const getDateOffset = <TDate extends unknown>(
  adapter: MuiPickersAdapter<TDate>,
  date: TDate,
) => {
  const utcHour = adapter.getHours(adapter.setTimezone(adapter.startOfDay(date), 'UTC'));
  const cleanUtcHour = utcHour > 12 ? 24 - utcHour : -utcHour;
  return cleanUtcHour * 60;
};
