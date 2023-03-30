import { MuiPickersAdapter } from '../internals/models/muiPickersAdapter';
import { DesktopTimeClockSectionOption } from './DesktopTimeClock.types';

interface IGetHoursSectionOptions<TDate> {
  now: TDate;
  value: TDate | null;
  utils: MuiPickersAdapter<TDate>;
  ampm: boolean;
  isDisabled: (value: number) => boolean;
}

export const getHourSectionOptions = <TDate>({
  now,
  value,
  utils,
  ampm,
  isDisabled,
}: IGetHoursSectionOptions<TDate>): DesktopTimeClockSectionOption<number>[] => {
  const currentHours = value ? utils.getHours(value) : null;

  const result: DesktopTimeClockSectionOption<number>[] = [];

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

  const endHour = ampm ? 11 : 23;
  for (let hour = 0; hour <= endHour; hour += 1) {
    let label = utils.format(utils.setHours(now, hour), ampm ? 'hours12h' : 'hours24h');

    label = utils.formatNumber(label);

    result.push({
      value: hour,
      label,
      isSelected,
      isDisabled,
    });
  }
  return result;
};

interface IGetTimeSectionOptions {
  value: number | null;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveLabel: (value: number) => string;
  hasValue?: boolean;
}

export const getTimeSectionOptions = ({
  value,
  isDisabled,
  timeStep,
  resolveLabel,
  hasValue = true,
}: IGetTimeSectionOptions): DesktopTimeClockSectionOption<number>[] => {
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
        label: resolveLabel(timeValue),
        isDisabled,
        isSelected,
      };
    }),
  ];
};
