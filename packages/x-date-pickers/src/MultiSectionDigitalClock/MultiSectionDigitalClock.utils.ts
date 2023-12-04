import { MuiPickersAdapter } from '../models';
import { MultiSectionDigitalClockOption } from './MultiSectionDigitalClock.types';

interface IGetHoursSectionOptions<TDate> {
  now: TDate;
  value: TDate | null;
  utils: MuiPickersAdapter<TDate>;
  ampm: boolean;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveAriaLabel: (value: string) => string;
}

export const getHourSectionOptions = <TDate>({
  now,
  value,
  utils,
  ampm,
  isDisabled,
  resolveAriaLabel,
  timeStep,
}: IGetHoursSectionOptions<TDate>): MultiSectionDigitalClockOption<number>[] => {
  const currentHours = value ? utils.getHours(value) : null;

  const result: MultiSectionDigitalClockOption<number>[] = [];

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
  for (let hour = 0; hour <= endHour; hour += timeStep) {
    let label = utils.format(utils.setHours(now, hour), ampm ? 'hours12h' : 'hours24h');
    const ariaLabel = resolveAriaLabel(parseInt(label, 10).toString());

    label = utils.formatNumber(label);

    result.push({
      value: hour,
      label,
      isSelected,
      isDisabled,
      ariaLabel,
    });
  }
  return result;
};

interface IGetTimeSectionOptions<TDate> {
  value: number | null;
  utils: MuiPickersAdapter<TDate>;
  isDisabled: (value: number) => boolean;
  timeStep: number;
  resolveLabel: (value: number) => string;
  hasValue?: boolean;
  resolveAriaLabel: (value: string) => string;
}

export const getTimeSectionOptions = <TDate>({
  value,
  utils,
  isDisabled,
  timeStep,
  resolveLabel,
  resolveAriaLabel,
  hasValue = true,
}: IGetTimeSectionOptions<TDate>): MultiSectionDigitalClockOption<number>[] => {
  const isSelected = (timeValue: number) => {
    if (value === null) {
      return false;
    }

    return hasValue && value === timeValue;
  };

  return [
    ...Array.from({ length: Math.ceil(60 / timeStep) }, (_, index) => {
      const timeValue = timeStep * index;
      return {
        value: timeValue,
        label: utils.formatNumber(resolveLabel(timeValue)),
        isDisabled,
        isSelected,
        ariaLabel: resolveAriaLabel(timeValue.toString()),
      };
    }),
  ];
};
