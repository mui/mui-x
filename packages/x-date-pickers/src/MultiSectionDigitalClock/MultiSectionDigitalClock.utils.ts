import { MuiPickersAdapter, PickerValidDate } from '../models';
import { MultiSectionDigitalClockOption } from './MultiSectionDigitalClock.types';

interface GetHoursSectionOptionsParameters {
  value: PickerValidDate | null;
  adapter: MuiPickersAdapter;
  ampm: boolean;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveAriaLabel: (value: string) => string;
  valueOrReferenceDate: PickerValidDate;
}

export const getHourSectionOptions = ({
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

  const endHour = ampm ? 11 : 23;
  for (let hour = 0; hour <= endHour; hour += timeStep) {
    // Compute the label from the loop index rather than from a concrete date.
    // Going through `adapter.setHours(now, hour)` can return the "wrong" hour on a DST
    // spring-forward day in some adapters (e.g. setting hours to 2 AM lands on 3 AM because
    // 2 AM does not exist), which previously led to duplicate labels and a missing entry in
    // the dropdown. See https://github.com/mui/mui-x/issues/21669.
    const displayedHour = ampm && hour === 0 ? 12 : hour;
    const ariaLabel = resolveAriaLabel(displayedHour.toString());
    const label = adapter.formatNumber(displayedHour.toString().padStart(2, '0'));

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
