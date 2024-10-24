import { MuiPickersAdapter, PickerValidDate } from '../models';
import { MultiSectionDigitalClockOption } from './MultiSectionDigitalClock.types';

interface GetHoursSectionOptionsParameters {
  now: PickerValidDate;
  value: PickerValidDate | null;
  utils: MuiPickersAdapter;
  ampm: boolean;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveAriaLabel: (value: string) => string;
  valueOrReferenceDate: PickerValidDate;
}

export const getHourSectionOptions = ({
  now,
  value,
  utils,
  ampm,
  isDisabled,
  resolveAriaLabel,
  timeStep,
  valueOrReferenceDate,
}: GetHoursSectionOptionsParameters): MultiSectionDigitalClockOption<number>[] => {
  const currentHours = value ? utils.getHours(value) : null;

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
    return isSelected(hour, utils.getHours(valueOrReferenceDate));
  };

  const endHour = ampm ? 11 : 23;
  for (let hour = 0; hour <= endHour; hour += timeStep) {
    let label = utils.format(utils.setHours(now, hour), ampm ? 'hours12h' : 'hours24h');
    const ariaLabel = resolveAriaLabel(parseInt(label, 10).toString());

    label = utils.formatNumber(label);

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
  utils: MuiPickersAdapter;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveLabel: (value: number) => string;
  hasValue?: boolean;
  resolveAriaLabel: (value: string) => string;
}

export const getTimeSectionOptions = ({
  value,
  utils,
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
        label: utils.formatNumber(resolveLabel(timeValue)),
        isDisabled,
        isSelected,
        isFocused,
        ariaLabel: resolveAriaLabel(timeValue.toString()),
      };
    }),
  ];
};
