import { MuiPickersAdapter } from '../internals/models/muiPickersAdapter';
import { DesktopTimeClockSectionOption } from './DesktopTimeClock.types';

interface IGetHoursSectionOptions<TDate> {
  value: TDate | null;
  utils: MuiPickersAdapter<TDate>;
  ampm: boolean;
  isDisabled: (value: number) => boolean;
}

export const getHourSectionOptions = <TDate>({
  value,
  utils,
  ampm,
  isDisabled,
}: IGetHoursSectionOptions<TDate>): DesktopTimeClockSectionOption[] => {
  const currentHours = value ? utils.getHours(value) : null;

  const result: DesktopTimeClockSectionOption[] = [];
  const startHour = ampm ? 1 : 0;
  const endHour = ampm ? 12 : 23;

  const isSelected = (hour: number) => {
    if (currentHours === null) {
      return false;
    }

    if (ampm) {
      if (hour === 12) {
        return currentHours === 12 || currentHours === 0;
      }

      return currentHours === hour || currentHours - 12 === hour;
    }

    return currentHours === hour;
  };

  for (let hour = startHour; hour <= endHour; hour += 1) {
    let label = hour.toString();

    if (hour === 0) {
      label = '00';
    }

    label = utils.formatNumber(label);

    const selected = isSelected(hour);
    result.push({
      value: hour,
      label,
      disabled: isDisabled(hour),
      selected,
    });
  }
  return result;
};

interface IGetTimeSectionOptions {
  value: number | null;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  hasValue?: boolean;
}

export const getTimeSectionOptions = ({
  value,
  isDisabled,
  timeStep,
  hasValue = true,
}: IGetTimeSectionOptions): DesktopTimeClockSectionOption[] => {
  const isSelected = (timeValue: number) => {
    if (value === null) {
      return false;
    }

    return hasValue && value === timeValue;
  };

  return [
    ...Array.from({ length: 60 / timeStep }, (_, index) => {
      const timeValue = timeStep * index;
      return {
        value: timeValue,
        label: timeValue.toString(),
        disabled: isDisabled(timeValue),
        selected: isSelected(timeValue),
      };
    }),
  ];
};
