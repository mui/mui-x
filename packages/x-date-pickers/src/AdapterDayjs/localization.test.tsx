import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, expectInputValue } from 'test/utils/pickers-utils';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  undefined: {
    placeholder: 'MM/DD/YYYY hh:mm aa',
    value: '05/15/2018 09:35 AM',
  },
  fr: {
    placeholder: 'DD/MM/YYYY hh:mm',
    value: '15/05/2018 09:35',
  },
  de: {
    placeholder: 'DD.MM.YYYY hh:mm',
    value: '15.05.2018 09:35',
  },
};
describe('<AdapterDayjs />', () => {
  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
    const localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };

    describe(`test with the ${localeName} locale`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'dayjs',
        locale: localeObject,
      });

      it('should have correct placeholder', () => {
        render(<DateTimePicker />);

        expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].placeholder, true);
      });

      it('should have well formatted value', () => {
        render(<DateTimePicker value={adapter.date(testDate)} />);

        expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].value, true);
      });
    });
  });

  it('should return the correct week number', () => {
    const adapter = new AdapterDayjs({ locale: 'fr' });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(45);
  });

  it('should return correct day of month with ordinal', () => {
    const adapter = new AdapterDayjs({});

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.format(dateToTest, 'dayOfMonthWithOrdinal')).to.equal('10th');
  });
});
