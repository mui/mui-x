import * as React from 'react';
import { ClockNumber } from './ClockNumber';
import { MuiPickersAdapter, PickerValidDate } from '../models';
import type { PickerSelectionState } from '../internals/hooks/usePicker';

interface GetHourNumbersOptions {
  ampm: boolean;
  value: PickerValidDate | null;
  getClockNumberText: (hour: string) => string;
  isDisabled: (value: number) => boolean;
  /**
   * DOM id that the selected option should have
   * Should only be `undefined` on the server
   */
  selectedId: string | undefined;
  utils: MuiPickersAdapter;
}

/**
 * @ignore - internal component.
 */
export const getHourNumbers = ({
  ampm,
  value,
  getClockNumberText,
  isDisabled,
  selectedId,
  utils,
}: GetHourNumbersOptions) => {
  const currentHours = value ? utils.getHours(value) : null;

  const hourNumbers: React.JSX.Element[] = [];
  const startHour = 0;
  const endHour = 23;

  const isSelected = (hour: number) => {
    if (currentHours === null) {
      return false;
    }
    return currentHours === hour;
  };

  for (let hour = startHour; hour <= endHour; hour += 1) {
    let label:string

    if (ampm && hour > 12) {
      label = (hour - 12).toString();
    } else {
      label = hour.toString()
    }

    if (ampm && hour === 0) {
      label = '12';
    }

    label = utils.formatNumber(label);

    const selected = isSelected(hour);

    hourNumbers.push(
      <ClockNumber
        key={hour}
        id={selected ? selectedId : undefined}
        index={hour}
        indexRange={24}
        selected={selected}
        disabled={isDisabled(hour)}
        label={label}
        aria-label={getClockNumberText(label)}
      />,
    );
  }

  return hourNumbers;
};


interface GetMinutesNumbersOptions {
  value: number;
  getClockNumberText: (value: string) => string;
  isDisabled: (value: number) => boolean;
  /**
   * DOM id that the selected option should have
   * Should only be `undefined` on the server
   */
  selectedId: string | undefined;
  utils: MuiPickersAdapter;
}


export const getMinutesNumbers = ({
  utils,
  value,
  isDisabled,
  getClockNumberText,
  selectedId,
}: GetMinutesNumbersOptions) => {
  const f = utils.formatNumber;

  return (
    [
      [5, f('05')],
      [10, f('10')],
      [15, f('15')],
      [20, f('20')],
      [25, f('25')],
      [30, f('30')],
      [35, f('35')],
      [40, f('40')],
      [45, f('45')],
      [50, f('50')],
      [55, f('55')],
      [0, f('00')],
    ] as const
  ).map(([numberValue, label], index) => {
    const selected = numberValue === value;
    return (
      <ClockNumber
        key={numberValue}
        label={label}
        id={selected ? selectedId : undefined}
        index={index + 1}
        indexRange={12}
        disabled={isDisabled(numberValue)}
        selected={selected}
        aria-label={getClockNumberText(label)}
      />
    );
  });
};
