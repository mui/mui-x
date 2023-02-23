import * as React from 'react';
import moment from 'moment/moment';
import jMoment from 'moment-jalaali';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import {
  buildFieldInteractions,
  createPickerRenderer,
  expectInputValue,
} from 'test/utils/pickers-utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField/DateTimeField';
import { FieldSectionType, MuiPickersAdapter } from '../internals/models/muiPickersAdapter';

const testDate = new Date(2018, 4, 15, 9, 35, 10);

function updateDate<TDate>(
  date: TDate,
  adapter: MuiPickersAdapter<TDate>,
  sectionType: FieldSectionType,
  diff: number,
) {
  switch (sectionType) {
    case 'year':
      return adapter.addYears(date, diff);
    case 'month':
      return adapter.addMonths(date, diff);
    case 'day':
    case 'weekDay':
      return adapter.addDays(date, diff);
    case 'hours':
      return adapter.addHours(date, diff);
    case 'minutes':
      return adapter.addMinutes(date, diff);
    case 'seconds':
      return adapter.addSeconds(date, diff);
    case 'meridiem':
      return adapter.setHours(date, (adapter.getHours(date) + 12 * diff) % 24);
    default:
      return null;
  }
}

const adapterToTest = [
  'luxon',
  'date-fns',
  'dayjs',
  'moment',
  'date-fns-jalali',
  // 'moment-hijri',
  'moment-jalaali',
] as const;

adapterToTest.forEach((adapterName) => {
  describe(`test keyboard interaction with ${adapterName} adapter`, () => {
    const { render, clock, adapter } = createPickerRenderer({
      clock: 'fake',
      adapterName,
    });

    before(() => {
      if (adapterName === 'moment-jalaali') {
        jMoment.loadPersian();
      } else if (adapterName === 'moment') {
        moment.locale('en');
      }
    });

    after(() => {
      if (adapterName === 'moment-jalaali') {
        moment.locale('en');
      }
    });

    const { clickOnInput } = buildFieldInteractions({ clock, render, Component: DateTimeField });

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

    const testKeyboardInteraction = (formatToken, sectionConfig) => {
      const sectionType =
        typeof sectionConfig === 'object' ? sectionConfig.sectionType : sectionConfig;
      it(`should increase "${sectionType}" when pressing ArrowUp on "${formatToken}" token`, () => {
        const initialValue = adapter.date(testDate);
        const expectedValue = updateDate(initialValue, adapter, sectionType, 1);

        testKeyPress({
          key: 'ArrowUp',
          initialValue,
          expectedValue,
          format: formatToken,
        });
      });

      it(`should decrease "${sectionType}" when pressing ArrowDown on "${formatToken}" token`, () => {
        const initialValue = adapter.date(testDate);
        const expectedValue = updateDate(initialValue, adapter, sectionType, -1);

        testKeyPress({
          key: 'ArrowDown',
          initialValue,
          expectedValue,
          format: formatToken,
        });
      });
    };

    Object.entries(adapter.formatTokenMap).forEach(([formatToken, sectionConfig]) =>
      testKeyboardInteraction(formatToken, sectionConfig),
    );
  });
});
