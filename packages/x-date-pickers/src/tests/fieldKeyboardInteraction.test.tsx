import * as React from 'react';
import { screen, userEvent, act } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField/DateTimeField';
import { MuiPickerFieldAdapter } from '../internals/models/muiPickersAdapter';

const testDate = new Date(2018, 4, 15, 9, 35, 10);

function updatedDate<TDate>(
  date: TDate,
  adapter: MuiPickerFieldAdapter<TDate>,
  sectionName: string,
  diff: number,
) {
  switch (sectionName) {
    case 'year':
      return adapter.addYears(date, diff);
      break;
    case 'month':
      return adapter.addMonths(date, diff);
      break;
    case 'day':
      return adapter.addDays(date, diff);
      break;
    case 'hour':
      return adapter.addHours(date, diff);
      break;
    case 'minute':
      return adapter.addMinutes(date, diff);
      break;
    case 'second':
      return adapter.addSeconds(date, diff);
      break;
    case 'meridiem':
      return adapter.setHours(date, (adapter.getHours(date) + 12 * diff) % 24);
      break;
    default:
      return null;
  }
}

const expectInputValue = (input: HTMLInputElement, expectedValue: string) =>
  expect(input.value.replace(/‎/g, '')).to.equal(expectedValue);

const adapterToTest: ("luxon" | "date-fns" | "dayjs" | "moment")[] = ['luxon', 'date-fns', 'dayjs', 'moment']

// const adapterToTest: ("luxon" | "date-fns" | "dayjs" | "moment")[] = ['luxon'];
// const adapterToTest: ('luxon' | 'date-fns' | 'dayjs' | 'moment')[] = ['date-fns'];
// const adapterToTest: ("luxon" | "date-fns" | "dayjs" | "moment")[] = ['dayjs'];
// const adapterToTest: ("luxon" | "date-fns" | "dayjs" | "moment")[] = ['moment'];

adapterToTest.forEach((adapterName) => {
  describe(`test keyboard interaction with ${adapterName} adapter`, () => {
    const { render, clock, adapter } = createPickerRenderer({
      clock: 'fake',
      adapterName,
    });

    const clickOnInput = (input: HTMLInputElement, cursorPosition: number) => {
      act(() => {
        input.focus();
        input.setSelectionRange(cursorPosition, cursorPosition);
        clock.runToLast();
      });
    };

    const testKeyPress = <TDate extends unknown>({
      key,
      format,
      initialValue,
      expectedValue,
      cursorPosition = 1,
    }: {
      key: string;
      format: string;
      initialValue: TDate;
      expectedValue: TDate;
      cursorPosition?: number;
    }) => {
      render(<DateTimeField defaultValue={initialValue} format={format} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      clickOnInput(input, cursorPosition);
      userEvent.keyPress(input, { key });
      expectInputValue(input, adapter.formatByString(expectedValue, format));
    };

    const testKeyboardInteraction = (formatToken, sectionData) => {
      const sectionName = typeof sectionData === 'object' ? sectionData.sectionName : sectionData;
      it(`should increase "${sectionName}" when pressing ArrowUp on "${formatToken}" token`, () => {
        const initialValue = adapter.date(testDate);
        const expectedValue = updatedDate(initialValue, adapter, sectionName, 1);

        testKeyPress({
          key: 'ArrowUp',
          initialValue,
          expectedValue,
          format: formatToken,
        });
      });

      it(`should decrease "${sectionName}" when pressing ArrowDown on "${formatToken}" token`, () => {
        const initialValue = adapter.date(testDate);
        const expectedValue = updatedDate(initialValue, adapter, sectionName, -1);

        testKeyPress({
          key: 'ArrowDown',
          initialValue,
          expectedValue,
          format: formatToken,
        });
      });
    };

    Object.entries(adapter.formatTokenMap).forEach(([formatToken, sectionName]) =>
      testKeyboardInteraction(formatToken, sectionName),
    );
  });
});
