import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, expectInputValue } from 'test/utils/pickers-utils';
import 'moment/locale/ar';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  ar: {
    placeholder: 'YYYY/MM/DD hh:mm',
    value: '١٤٣٩/٠٨/٢٩ ٠٩:٣٥',
  },
};

describe('<AdapterMomentHijri />', () => {
  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeObject = { code: localeKey };

    describe(`test with the locale "${localeKey}"`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'moment-hijri',
        locale: localeObject,
      });

      it('should have correct placeholder', () => {
        render(<DateTimePicker label="test" />);

        expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].placeholder, true);
      });

      it('should have well formatted value', () => {
        render(<DateTimePicker label="test" value={adapter.date(testDate)} />);

        expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].value, true);
      });
    });
  });

  it('should return the correct week number', () => {
    const adapter = new AdapterMomentHijri();

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(16);
  });
});
