import { MuiPickersAdapter, PickerValidDate } from '../models';
import { MultiSectionDigitalClockOption } from './MultiSectionDigitalClock.types';

interface GetHoursSectionOptionsParameters {
  now: PickerValidDate;
  value: PickerValidDate | null;
  adapter: MuiPickersAdapter;
  ampm: boolean;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveAriaLabel: (value: string) => string;
  valueOrReferenceDate: PickerValidDate;
}

export const getHourSectionOptions = ({
  now,
  value,
  adapter,
  ampm,
  isDisabled,
  resolveAriaLabel,
  timeStep,
  valueOrReferenceDate,
}: GetHoursSectionOptionsParameters): MultiSectionDigitalClockOption<number>[] => {
  const currentHours = value ? adapter.getHours(value) : null;

  const result: MultiSectionDigitalClockOption<number>[] = [];

  const isSelected = (hour: number, overriddenCurrentHours?: number) => {
    const resolvedCurrentHours = overriddenCurrentHours ?? currentHours;
    if (resolvedCurrentHours === null) {
      return false;
    }

    if (ampm) {
      if (hour === 12) {
        return resolvedCurrentHours === 12 || resolvedCurrentHours === 0;
      }

      return resolvedCurrentHours === hour || resolvedCurrentHours - 12 === hour;
    }

    return resolvedCurrentHours === hour;
  };

  const isFocused = (hour: number) => {
    return isSelected(hour, adapter.getHours(valueOrReferenceDate));
  };

  // Use January 15 as a DST-free reference so `adapter.setHours(reference, N)`
  // always yields a date whose local hour is `N`. On a DST spring-forward day
  // setting a non-existent hour rolls forward, producing duplicate labels —
  // see https://github.com/mui/mui-x/issues/22084.
  const labelReferenceDate = adapter.setDate(adapter.setMonth(adapter.startOfDay(now), 0), 15);

  const endHour = ampm ? 11 : 23;
  for (let hour = 0; hour <= endHour; hour += timeStep) {
    let label = adapter.format(
      adapter.setHours(labelReferenceDate, hour),
      ampm ? 'hours12h' : 'hours24h',
    );
    const ariaLabel = resolveAriaLabel(parseInt(label, 10).toString());

    label = adapter.formatNumber(label);

    result.push({
      value: hour,
      label,
      isSelected,
      isDisabled,
      isFocused,
      ariaLabel,
    });
  }
  return result;
};

interface GetTimeSectionOptionsParameters {
  value: number | null;
  adapter: MuiPickersAdapter;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveLabel: (value: number) => string;
  hasValue?: boolean;
  resolveAriaLabel: (value: string) => string;
}

export const getTimeSectionOptions = ({
  value,
  adapter,
  isDisabled,
  timeStep,
  resolveLabel,
  resolveAriaLabel,
  hasValue = true,
}: GetTimeSectionOptionsParameters): MultiSectionDigitalClockOption<number>[] => {
  const isSelected = (timeValue: number) => {
    if (value === null) {
      return false;
    }

    return hasValue && value === timeValue;
  };

  const isFocused = (timeValue: number) => {
    return value === timeValue;
  };

  return [
    ...Array.from({ length: Math.ceil(60 / timeStep) }, (_, index) => {
      const timeValue = timeStep * index;
      return {
        value: timeValue,
        label: adapter.formatNumber(resolveLabel(timeValue)),
        isDisabled,
        isSelected,
        isFocused,
        ariaLabel: resolveAriaLabel(timeValue.toString()),
      };
    }),
  ];
};
