import sinon from 'sinon';
import { MuiPickersAdapter, PickerValidDate } from '@mui/x-date-pickers/models';
import { PickerComponentFamily } from './describe.types';
import { OpenPickerParams } from './openPicker';

export const stubMatchMedia = (matches = true) =>
  sinon.stub().returns({
    matches,
    addListener: () => {},
    addEventListener: () => {},
    removeListener: () => {},
    removeEventListener: () => {},
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
  if (componentFamily === 'picker' && params.type === 'date-time-range') {
    return (
      getChangeCountForComponentFamily(componentFamily) +
      getChangeCountForComponentFamily('multi-section-digital-clock')
    );
  }
  if (componentFamily === 'clock') {
    // the `TimeClock` fires change for both touch move and touch end
    // but does not have meridiem control
    return (getChangeCountForComponentFamily(componentFamily) - 1) * 2;
  }
  return getChangeCountForComponentFamily(componentFamily);
};

export const getDateOffset = (adapter: MuiPickersAdapter, date: PickerValidDate) => {
  const utcHour = adapter.getHours(adapter.setTimezone(adapter.startOfDay(date), 'UTC'));
  const cleanUtcHour = utcHour > 12 ? 24 - utcHour : -utcHour;
  return cleanUtcHour * 60;
};

export const formatFullTimeValue = (adapter: MuiPickersAdapter, value: PickerValidDate) => {
  const hasMeridiem = adapter.is12HourCycleInCurrentLocale();
  return adapter.format(value, hasMeridiem ? 'fullTime12h' : 'fullTime24h');
};
